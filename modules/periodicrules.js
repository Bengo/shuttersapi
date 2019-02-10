const schedule = require('node-schedule');
const SunCalc = require('suncalc');

const shutters = require('./shutters');
const configRules = require('./configRules');

const everyDayRule = new schedule.RecurrenceRule();
everyDayRule.hour = 1;
everyDayRule.minute = 0;

var upSchedulers = new Map();
var downSchedulers = new Map();


//cancel all current schedulers
function cancelSchedulers(){
  const zones = configRules.config.zone;
  for(var zone in zones){
    if(upSchedulers && upSchedulers.get(zone)){
      upSchedulers.get(zone).cancel();
    } 
    if(downSchedulers && downSchedulers.get(zone)){
      downSchedulers.get(zone).cancel();
    }
  }
}

//init up schedulers for each zone
function initUpSchedulers(times){
  const zones = configRules.config.zone;
  for(var zone in zones){
    const cronUp = configRules.getCronUp(zone,times.sunriseEnd);
    if(cronUp){
      console.log('zone '+zone+' - cronup :'+cronUp);
      upSchedulers.set(zone,
        schedule.scheduleJob(cronUp, function(zone){
          shutters.goTo(zone,'top');
        }.bind(null, zone))
      );
    }
  }
}

//init down schedulers for each zone
function initDownSchedulers(times){
  const zones = configRules.config.zone;
  for(var zone in zones){
    const cronDown = configRules.getCronDown(zone,times.sunset);
    if(cronDown){
      console.log('zone '+zone+ ' - cronDown :'+cronDown);
      downSchedulers.set(zone,
          schedule.scheduleJob(zone, cronDown, function(zone){
          shutters.goTo(zone,'bottom');
        }.bind(null, zone))
      );
    }
  }

}

//instantiate the schedulers for opening and closing shutters
function initAutomaticShutters(){
  //Saint-Renan
  const times = SunCalc.getTimes( new Date(), 48.4333, -4.6167);

  //si mode normal , alors mercredi, samedi, dimanche on force le mode vacancesWE
  if(configRules.config.currentMode === "normal"){
    const todayDay = new Date().getDay();
    if(todayDay == 0 || todayDay == 6 || todayDay == 3){
      configRules.config.currentMode = "vacancesWE";
    }
  }
  console.log("current mode", configRules.config.currentMode);
  cancelSchedulers();

  initUpSchedulers(times);

  initDownSchedulers(times);
 
}

exports.start = function (){

    //on startup and every day we start the job calculating for opening and closing shutters
   initAutomaticShutters();

   schedule.scheduleJob(everyDayRule, function(){
        initAutomaticShutters();
    });
};

exports.infos = function (){

  const infos = {};
  infos.nextUp = [];

  upSchedulers.forEach(function(schedule,zone ){
    const upZone = {};
    upZone.zone = zone;
    upZone.date = new Date(schedule.nextInvocation()).toLocaleString();
    infos.nextUp.push(upZone);
  });

  infos.nextDown = [];
  downSchedulers.forEach(function(schedule,zone ){
    const downZone = {};
    downZone.zone = zone;
    downZone.date = new Date(schedule.nextInvocation()).toLocaleString();
    infos.nextDown.push(downZone);
  });
  return infos;
};