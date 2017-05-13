require('dotenv').config();

import twilio from 'twilio';
import moment from 'moment';
import axios from 'axios';
import temp from 'kelvin-to-fahrenheit'

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const sms = {
  sendScheduledGame: ({smsNum, gameLoc, gameTime, sport}) => {
    // real text
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=NewOrleans&APPID=${process.env.WEATHER_ID}`)
      .then((weather) => {
        let currentTemp = temp(weather.data.main.temp)
        let message = `We're playing ${sport} @ ${gameLoc} for ${moment(gameTime).format('llll')}. Expect ${weather.data.weather[0].main} and a Temp of ${currentTemp}°F. See you there!`;
        console.log('helol weather console log 1');
        return new Promise((resolve, reject) => {
          client.sendMessage({
            to: smsNum,
            from: process.env.TWILIO_NUM,
            body: message
          }, (err, resp) => {
            if (err) {
              console.error('Error sending SMS: ', err);
              reject(err);
            } else {
              console.log(resp, 'weather console .log 2');
              resolve(resp);
            }
          });
        });
    }).catch(err => console.error(err));
  },
  sendError: (smsNum, error) => {
    return new Promise((resolve, reject) => {
      client.sendMessage({
        to: smsNum,
        from: process.env.TWILIO_NUM,
        body: error,
      }, (err, resp) => {
        if(err) {
          console.error('Error sending SMS: ', err);
          reject(err);
        } else {
          console.log(resp);
          resolve(resp);
        }
      });
    });
  },

};

export default sms;