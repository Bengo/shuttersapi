const schedule = require('node-schedule');
const SunCalc = require('suncalc');
const shutters = require('./shutters');
const configRules = require('./configRules');

const everyDayRule = new schedule.RecurrenceRule();
everyDayRule.hour = 0;
everyDayRule.minute = 0;

var upSchedulers = new Map();
var downSchedulers = new Map();

//instantiate the schedulers for opening and closing shutters
function initAutomaticShutters(zone){
  //Saint-Renan
  const times = SunCalc.getTimes( new Date(), 48.4333, -4.6167);

  if(upSchedulers && upSchedulers.get(zone)){
    upSchedulers.get(zone).cancel();
  } 
  if(downSchedulers && downSchedulers.get(zone)){
    downSchedulers.get(zone).cancel();
  }

  if(configRules.isActive(zone,times.sunriseEnd)){
    console.log('times.sunriseEnd :'+times.sunriseEnd);
    console.log('times.sunset :'+times.sunset);
    const cronUp = times.sunriseEnd.getMinutes()+' '+times.sunriseEnd.getHours()+' * * *';
    console.log('cronup :'+cronUp);
    upSchedulers.set(zone,
      schedule.scheduleJob(cronUp, function(){
        shutters.goTo(zone,'top');
      })
    );
    const cronDown = times.sunset.getMinutes()+' '+times.sunset.getHours()+' * * *';
    console.log('cronDown :'+cronDown);
    downSchedulers.set(zone,
       schedule.scheduleJob(cronDown, function(){
        shutters.goTo(zone,'bottom');
      })
    );
  }

  console.log(new Date() + ' : init shutters schedulers done ! ');
}

exports.start = function (){
    //on startup and every day we start the job calculating for opening and closing shutters
   initAutomaticShutters('3');

   schedule.scheduleJob(everyDayRule, function(){
        initAutomaticShutters('3');
    });
};

exports.infos = function (){

  const infos = {};
  infos.nextUp = [];
  if(upSchedulers.get('3')){
    infos.nextUp[3] = new Date(upSchedulers.get('3').nextInvocation()).toLocaleTimeString();
  }
  infos.nextDown = [];
  if(downSchedulers.get('3')){
    infos.nextDown[3] = new Date(downSchedulers.get('3').nextInvocation()).toLocaleTimeString();
  }
  return infos;
};