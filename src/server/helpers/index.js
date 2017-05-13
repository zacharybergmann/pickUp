require('dotenv').config();

import moment from 'moment';
import crypto from 'crypto';
import phone from 'phone';
import geocoder from 'geocoder';

const helpers = {
  createGameTime: (reqTime) => {
    // works for TODAY
    let gameTime = new Date(
      moment().get('year'),
      moment().get('month'),
      moment().get('date'),
      parseInt(reqTime)
    );
    return gameTime;
  },
  // using === instead of >= to avoid multiple texts 
  // put texted flag on each player
  hasEnoughPlayers: game => game.playRequests === game.minPlayers,

  includesPlayer: (game, smsNum) => game.smsNums.reduce((included, smsObj) => {
    return smsObj.smsNum === smsNum || included;
  }, false),

  forEachPlayer: (game, cb) => {
    game.smsNums.forEach(smsObj => {
      cb(smsObj.smsNum);
    });
  },

  phone: num => phone(num)[0],

  reverseGeocode: (avgLoc, cb) => {
    let geoLng = +avgLoc.split(',')[0];
    let geoLat = +avgLoc.split(',')[1];

    console.log("REVERSE AVG:", avgLoc, "TYPE", typeof (avgLoc));
    console.log("LONG/LAT", geoLng, geoLat);
    geocoder.reverseGeocode(geoLat, geoLng, function (err, data) {
      if (err) {
        console.log("Sorry you had a location error:", err);
      } else {
        console.log("DATA geocode components", data.results[0].address_components[0].long_name);
        console.log("DEGEOCODE-TEST", data.results[0].formatted_address);
        console.log("DEGEOCODE-TEST", data.results[0]);
        //  cb(data.results[0].address_components[0].long_name, data.results[0].formatted_address);
        cb(data.results[0].formatted_address);
      } // do something with data 
    });
  },

  findCentralLocation: (game, cb) => {
    game.smsNums.forEach(users => {
      cb(users.address);
    });
  }

};

export default helpers;