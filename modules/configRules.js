const fs = require("fs");
const path = require("path");
    
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../config/config.json')));
exports.config = config;

//return the cron execution date for opening the zone or null if non activ
exports.getCronUp = function (zone, date){

    const confMode = config.mode[config.currentMode];
    let zoneConf = null;
    if(confMode){
        zoneConf = confMode.zone[zone];
    }
    let upConf = null;
    if(zoneConf){
        upConf = zoneConf.up;
    }
    
    let cronUp = null;
    if(upConf && upConf === "sun"){
        cronUp = date.getMinutes()+' '+date.getHours()+' * * *';
    }
    if(upConf && upConf === "time"){
        const hours = config.zone[zone].up["hours"];
        const minutes = config.zone[zone].up["minutes"];
        cronUp = minutes+' '+hours+' * * *';
    }
    //heure du soleil ou avant 
    if(upConf && upConf === "sunTime"){
        const hours = config.zone[zone].up["hours"];
        const minutes = config.zone[zone].up["minutes"];
        var todayMax = new Date();
        todayMax.setHours(hours);
        todayMax.setMinutes(minutes);
        todayMax.setSeconds(0);
        if(date<todayMax) {
            cronUp = date.getMinutes()+' '+date.getHours()+' * * *';
        } else {
            cronUp = minutes+' '+hours+' * * *';
        }  
    }
    
    // no conf or off
    return cronUp;   
}

//return the cron execution date for closing the zone or null if non activ
exports.getCronDown = function (zone, date){

    const confMode = config.mode[config.currentMode];
    let zoneConf = null;
    if(confMode){
        zoneConf = confMode.zone[zone];
    }
    let downConf = null;
    if(zoneConf){
        downConf = zoneConf.down;
    }
    
    let cronDown = null;
    if(downConf && downConf === "sun"){
        cronDown = date.getMinutes()+' '+date.getHours()+' * * *';
    }
    if(downConf && downConf === "time"){
        const hours = config.zone[zone].down["hours"];
        const minutes = config.zone[zone].down["minutes"];
        cronDown = minutes+' '+hours+' * * *';
    }

    //heure du soleil ou avant 
    if(downConf && downConf === "sunTime"){
        
        const hours = config.zone[zone].down["hours"];
        const minutes = config.zone[zone].down["minutes"];
        var todayMax = new Date();
        todayMax.setHours(hours);
        todayMax.setMinutes(minutes);
        todayMax.setSeconds(0);

        if(date<todayMax) {
            cronDown = date.getMinutes()+' '+date.getHours()+' * * *';
        } else {
            cronDown = minutes+' '+hours+' * * *';
        }  
    }

    // no conf or off
    return cronDown;
}