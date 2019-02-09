//functions for  shutters interactions
const Gpio = require('onoff').Gpio;
var sleep = require('sleep');

//set 1 sleep set 0 sleep
function edge(gpio, nbIter) {
    let i = 0 ;
    while(i<nbIter){
        gpio.writeSync(1);
        sleep.msleep(100);
        gpio.writeSync(0);
        sleep.msleep(100);
        i++;
    }
}

//action Pin
function actionPin(gpio, position){
    gpio.writeSync(0);
    if(position === 'top') {
        edge(gpio, 3);
    }
    if(position === 'bottom') {
        edge(gpio, 4);
    }
    if(position === 'intermediate'){
		// top
		edge(gpio, 3);
		//on attend que les volets soient leves
		sleep.sleep(18);
		//bottom
		edge(gpio, 4);
		//on attend d'atteindre le position intermediaire
		sleep.msleep(8800);
		//stop
        edge(gpio, 1);
    }
}

exports.goTo = function (zone, position) {
    console.log('zone '+zone+' go to position '+position);
    //chambre bas : zone 1 -> pin 17
    let chBas;
    //chambres haut : zone 2 -> pin 27
    let chHaut;
    //piece de vies : zone 3 -> pin 18
    let pdv;
    //generale : zone 4
    let generale;

    if(Gpio.accessible()) {
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
