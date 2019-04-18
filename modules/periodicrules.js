const schedule = require('node-schedule');
const SunCalc = require('suncalc');
const weather = require('openweather-apis');

const shutters = require('./shutters');
const configRules = require('./configRules');

var dailyScheduler = null;

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
  if(!(configRules.config.currentMode === "vacances" || configRules.config.currentMode === "abscence")){
    //si mode normal , alors mercredi, samedi, dimanche on force le mode msd
    if(configRules.config.currentMode === "normal"){
      const todayDay = new Date().getDay()
      if(todayDay === 0 || todayDay === 6 || todayDay === 3){
        configRules.config.currentMode = "msd";
      } 
    } else if(configRules.config.currentMode === "msd"){
      const todayDay = new Date().getDay();

      if(todayDay !== 0 && todayDay !== 6 && todayDay !== 3){
        configRules.config.currentMode = "normal";
      } 
    }
  }
  console.log(new Date() +" current mode " + configRules.config.currentMode);
  cancelSchedulers();

  initUpSchedulers(times);

  initDownSchedulers(times);

  //intermediate position for today is not reached
  configRules.config.today.intermediate = false;
 
}

function getCurrentWeather() {
  weather.setLang('fr');
  weather.setCoordinate(48.4333, -4.6167);
  weather.setUnits('metric');
  weather.setAPPID('d9ade1db2996b5348874f4c4dd2592b6');
  
  // get a simple JSON Object with temperature, humidity, pressure and description
  weather.getSmartJSON(function(err, JSONObj){
      configRules.weather = JSONObj;
  });
  
}

function checkIntermediate() {
  console.log('checkIntermediate');
  const currentWeather = configRules.weather;
  //if temp > 19 and weathercode (800,801,802) --> go To Intermediate position
  if(!configRules.config.today.intermediate && currentWeather.temp >= 10 && (currentWeather.weathercode === 800 || currentWeather.weathercode === 801 || currentWeather.weathercode === 802 )){
    console.log('Set Intermediate Position because weather is:'+ JSON.stringify(currentWeather));
    //zone 1 (chbas) and 3 (pdv) 
    shutters.goTo('1','intermediate');
    shutters.goTo('3','intermediate');
    //zone 2 only on mode normal + abscence
    if(configRules.config.currentMode === "normal" || configRules.config.currentMode === "abscence") {
      //shutters.goTo(2,'intermediate');
    }
    configRules.config.today.intermediate = true;
  } 
}

exports.start = function (){

    //on startup and every day we start the job calculating for opening and closing shutters
   initAutomaticShutters();
   getCurrentWeather();
   const everyDayRule = new schedule.RecurrenceRule();
   everyDayRule.hour = 4;
   everyDayRule.minute = 0;

   dailyScheduler = schedule.scheduleJob(everyDayRule, function(){
        initAutomaticShutters();
    });
    
    //every hour get currentWeather
    schedule.scheduleJob('34 * * * *', function(){
      getCurrentWeather();
    }); 

    //every hour between 10 and 18h
    schedule.scheduleJob('15 10-18 * * *', function(){
      checkIntermediate();
    });   

};

exports.update = function (){
  initAutomaticShutters();
}

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

  infos.nextDaily = {};
  infos.nextDaily.date = new Date(dailyScheduler.nextInvocation()).toLocaleString();
  infos.weather = configRules.weather;

  infos.mode = configRules.config.currentMode;
  return infos;
};