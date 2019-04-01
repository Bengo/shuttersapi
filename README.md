# shuttersapi
Shutters api


   install dependencies:
     $ npm install

   run the app:
     $ DEBUG=shuttersapi:* npm start




Raspberry gpio config

on raspbian pinout !!

pi@raspberrypi:~ $ pinout
+------------------| |--| |------+
| ooooooooooooo P1 |C|  |A|      |
| 1oooooooooooo    +-+  +-+      |
|    1ooo                        |
| P5 oooo        +---+          +====
|                |SoC|          | USB
|   |D| Pi Model +---+          +====
|   |S| B  V2.0                  |
|   |I|                  |C|+======
|                        |S||   Net
|                        |I|+======
=pwr             |HDMI|          |
+----------------|    |----------+

Revision           : 000f
SoC                : BCM2835
RAM                : 512Mb
Storage            : SD
USB ports          : 2 (excluding power)
Ethernet ports     : 1
Wi-fi              : False
Bluetooth          : False
Camera ports (CSI) : 1
Display ports (DSI): 1

P1:
   3V3  (1) (2)  5V    
 GPIO2  (3) (4)  5V    
 GPIO3  (5) (6)  GND   
 GPIO4  (7) (8)  GPIO14
   GND  (9) (10) GPIO15
GPIO17 (11) (12) GPIO18
GPIO27 (13) (14) GND   
GPIO22 (15) (16) GPIO23
   3V3 (17) (18) GPIO24
GPIO10 (19) (20) GND   
 GPIO9 (21) (22) GPIO25
GPIO11 (23) (24) GPIO8 
   GND (25) (26) GPIO7 

P5:
    5V (1) (2) 3V3   
GPIO28 (3) (4) GPIO29
GPIO30 (5) (6) GPIO31
   GND (7) (8) GND   


pm2 restart shutters-api
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [shutters-api](ids: 0)
[PM2] [shutters-api](0) ✓
┌──────────────┬────┬─────────┬──────┬──────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name     │ id │ version │ mode │ pid  │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├──────────────┼────┼─────────┼──────┼──────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ shutters-api │ 0  │ 0.0.0   │ fork │ 1378 │ online │ 1       │ 0s     │ 0%  │ 13.2 MB   │ pi   │ disabled │
└──────────────┴────┴─────────┴──────┴──────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘

pi@raspberrypi:~ $ pm2 list
┌──────────────┬────┬─────────┬──────┬──────┬────────┬─────────┬────────┬──────┬───────────┬──────┬──────────┐
│ App name     │ id │ version │ mode │ pid  │ status │ restart │ uptime │ cpu  │ mem       │ user │ watching │
├──────────────┼────┼─────────┼──────┼──────┼────────┼─────────┼────────┼──────┼───────────┼──────┼──────────┤
│ shutters-api │ 0  │ 0.0.0   │ fork │ 1464 │ online │ 3       │ 39h    │ 0.4% │ 45.3 MB   │ pi   │ disabled │
└──────────────┴────┴─────────┴──────┴──────┴────────┴─────────┴────────┴──────┴───────────┴──────┴──────────┘

pi@raspberrypi:~ $ pm2 list
┌──────────────┬────┬─────────┬──────┬──────┬────────┬─────────┬────────┬──────┬───────────┬──────┬──────────┐
│ App name     │ id │ version │ mode │ pid  │ status │ restart │ uptime │ cpu  │ mem       │ user │ watching │
├──────────────┼────┼─────────┼──────┼──────┼────────┼─────────┼────────┼──────┼───────────┼──────┼──────────┤
│ shutters-api │ 0  │ 0.0.0   │ fork │ 1464 │ online │ 3       │ 5D     │ 0.3% │ 47.3 MB   │ pi   │ disabled │
└──────────────┴────┴─────────┴──────┴──────┴────────┴─────────┴────────┴──────┴───────────┴──────┴──────────┘



│ App name     │ id │ version │ mode │ pid  │ status │ restart │ uptime │ cpu  │ mem       │ user │ watching │
├──────────────┼────┼─────────┼──────┼──────┼────────┼─────────┼────────┼──────┼───────────┼──────┼──────────┤
│ shutters-api │ 0  │ 0.0.0   │ fork │ 6827 │ online │ 5       │ 7D     │ 0.3% │ 48.3 MB   │ pi   │ disabled │
└──────────────┴────┴─────────┴──────┴──────┴────────┴─────────┴────────┴──────┴───────────┴──────┴──────────┘
