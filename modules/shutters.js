//functions for  shutters interactions
const Gpio = require('onoff').Gpio;
const sleep = require('sleep');
class Shutters{

    constructor(){
    };

    //set 1 sleep set 0 sleep
    edge(pin, nbIter) {
        let i = 0 ;
        while(i<nbIter){
            pin.writeSync(1);
            msleep(100);
            pin.writeSync(0);
            msleep(100);
            i++;
        }
    }

    //action Pin
    actionPin(pin, position){
        pin.writeSync(0);
        if(position === 'top') {
            edge(pin, 3);
        }
        if(position === 'bottom') {
            edge(pin, 4);
        }
        if(position === 'intermediate'){
            // top
            edge(pin, 3);
            //on attend que les volets soient leves
            _sleep(18);
            //bottom
            edge(pin, 4);
            //on attend d'atteindre le position intermediaire
            msleep(8800);
            //stop
            edge(pin, 1);
        }
    }

    goTo(zone, position) {
        console.log('zone '+zone+' go to position '+position);
        //chambre bas : zone 1 -> pin 17
        let chBas;
        //chambres haut : zone 2 -> pin 27
        let chHaut;
        //piece de vies : zone 3 -> pin 18
        let pdv;
        //generale : zone 4
        let generale;

        if(Gpio.accessible) {
            if(zone === '1'){
                chBas = new Gpio(17, 'out');
                actionPin(chBas, position);
            }
            if(zone === '2'){
                chHaut = new Gpio(27, 'out');
                actionPin(chHaut, position);
            }
            if(zone === '3'){
                pdv = new Gpio(18, 'out');
                actionPin(pdv, position);
            }
            if(zone === '4') {
                chBas = new Gpio(17, 'out');
                chHaut = new Gpio(27, 'out');
                pdv = new Gpio(18, 'out');
                actionPin(chBas, position);
                actionPin(chHaut, position);
                actionPin(pdv, position);
            }
        } else {
            chBas = {
            writeSync: (value) => {
                console.log('virtual chBas now uses value: ' + value);
            }
            };
            chHaut = {
                writeSync: (value) => {
                console.log('virtual chHaut now uses value: ' + value);
                }
            };
            pdv = {
                writeSync: (value) => {
                    console.log('virtual pdv now uses value: ' + value);
                }
            };
            generale = {
                writeSync: (value) => {
                    console.log('virtual generale now uses value: ' + value);
                }
            };
        }
    };
}
module.exports = Shutters;

