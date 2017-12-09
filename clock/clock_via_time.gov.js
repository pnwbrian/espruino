// Baseline the RTC via time.gov by "borrowing" their HTTP header's DATE field

const wifi = require("EspruinoWiFi");

const http = require("http");

const LOCAL_GMT_ADJUSTMENT = "+0800";  // ISO reverses the signage

/* Heavily inspired by Martin Green's lightweight Clock module */

function Clock() {

	this.b = getTime();  

	if (arguments.length > 1)

		this.c = new Date(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);

	else if (arguments.length == 1)

		this.c = new Date(arguments[0]);

	else

		this.c = new Date();

}

Clock.prototype.setClock = function(ms) { this.b = getTime(); this.c = new Date(ms); };

Clock.prototype.getDate = function () { return new Date((getTime()-this.b)*1000 + this.c.getTime()); };

Clock.prototype.setByHTTP = function (wifi_ssid, wifi_pw) {
  
  var _self = this;

  wifi.connect(wifi_ssid, { password:wifi_pw } , function(err) {

    if (!err) {
      
      http.get("http://time.gov", function(res) {

        if ("Date" in res.headers) {

          var srvts = new Date(res.headers.Date + LOCAL_GMT_ADJUSTMENT);

          _self.setClock(srvts.ms);

        }

    //    wifi.disconnect();

      });

    }

  });

};

var RTC = new Clock();

RTC.setByHTTP("<your-wifi-ssid>","<your-wifi-password>");

// See http://www.espruino.com/Reference#Date regarding supported DATE object

// For example, RTC.getDate().getHours()
