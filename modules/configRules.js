const fs = require("fs");

const config = JSON.parse(fs.readFileSync('./config/config.json'))
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

    // no conf or off
    return cronDown;
}