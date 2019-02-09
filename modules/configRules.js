exports.isActive = function (zone, date){
    //TODO a complexifier mode vacances/fetes + zone + sieste
    //non active on WE
    
    //pdv always active
    if(zone === '3'){
        return true;
    }
    if(date.getDay() === 0 || date.getDay() === 6){
        return false;
    } else {
        return true;
    }
}