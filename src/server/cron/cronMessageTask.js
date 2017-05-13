import mongoose from 'mongoose';
import twilio from 'twilio';
import moment from 'moment';
import Game from '../games/gameModel';

const cron = require('node-cron');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

cron.schedule('30 * * * *', () => {
  let time = new Date();
  let checkTime = `${time.getFullYear()}-0${time.getMonth()+1}-${time.getDate()}T${time.getHours()}:00:00.000Z`
  console.log(checkTime, 'check time');

  Game.find({ 'startTime': checkTime }, 'sport minPlayers startTime playRequests smsNums', (err, games) => {
    if (err) {
      console.error(err, 'Error');
    } else if (games.length === 0) {
      return;
    } else {
      if (games[0].minPlayers <= games[0].playRequests) {
        games[0].smsNums.forEach((num, index) => {
          if (index === 0) { num.smsNum = num.smsNum.slice(2); }
          client.sendMessage({
              to: `+1${num.smsNum}`,
              from: process.env.TWILIO_NUM,
              body: `Hey, don't forget about the ${games[0].sport} game at ${games[0].startTime.getHours() >= 12 ? games[0].startTime.getHours() - 12: games[0].startTime.getHours()}:00! Have fun! :)`
            }, (err, resp) => {
              if (err) {
                console.error('Error sending SMS: ', err);
              } else {
                console.log(resp, 'response');
              }
            });
          })
        } else {
          games[0].smsNums.forEach((num, index) => {
            if (index === 0) { num.smsNum = num.smsNum.slice(2); }
            client.sendMessage({
              to: `+1${num.smsNum}`,
              from: process.env.TWILIO_NUM,
              body: `Hey, sorry the ${games[0].sport} game you wanted to play at ${games[0].startTime.getHours() >= 12 ? games[0].startTime.getHours() - 12: games[0].startTime.getHours()}:00 didn't get enough players. Feel free to try back another time.`
            }, (err, resp) => {
              if (err) {
                console.error('Error sending SMS: ', err);
              } else {
                console.log(resp, 'response');
              }
            });
          })
        }
    }
  });
})



