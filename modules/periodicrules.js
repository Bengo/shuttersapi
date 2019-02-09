const schedule = require('node-schedule');
const SunCalc = require('suncalc');
const shutters = require('./shutters');

const everyDayRule = new schedule.RecurrenceRule();
everyDayRule.hour = 0;
everyDayRule.minute = 0;

let upSchedule = null;
let downSchedule = null;

//instantiate the schedulers for opening and closing shutters
function initAutomaticShutters(){
  //Saint-Renan
  const times = SunCalc.getTimes( new Date(), 48.4333, -4.6167);
  console.log(times.sunriseEnd+ ' - '+times.sunset);
  if(upSchedule){
    upSchedule.cancel();
  } 
  upSchedule = schedule.scheduleJob(times.sunriseEnd, function(){
    //pdv
    shutters.goTo('3','top');
  });
  
  if(downSchedule){
    downSchedule.cancel();
  }
  downSchedule = schedule.scheduleJob(times.sunset, function(){
    //pdv
    shutters.goTo('3','bottom');
  });
}

exports.start = function (){
    //every day we start the job calculating for opening and closing shutters
   schedule.scheduleJob(everyDayRule, function(){
        initAutomaticShutters();
    });
};

exports.stop = function (){

};