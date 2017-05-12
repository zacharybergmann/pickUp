import mongoose from 'mongoose';
import twilio from 'twilio';
import moment from 'moment';
import Game from '../games/gameModel';

const cron = require('node-cron');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

let time = new Date();
let checkTime = `${time.getFullYear()}-0${time.getMonth()+1}-${time.getDate()}T${time.getHours()+3}:00:00.000Z`

cron.schedule('*/30 * * * *', () => {
  console.log(checkTime, 'check time')
  Game.find({ 'startTime': checkTime }, 'sport minPlayers playRequests smsNums', (err, games) => {
    if (err) {
      console.error(err, 'Error');
    } else {
      games.forEach(game => {
        if (game.minPlayers === game.playRequests) {
          client.sendMessage({
              to: `+1${num.smsNum}`,
              from: process.env.TWILIO_NUM,
              body: `Hey, don't forget about the ${game.sport} game at ${time.getHours() > 12 ? time.getHours() - 12 + 1: time.getHours()}:00! Have fun! :)`
            }, (err, resp) => {
              if (err) {
                console.error('Error sending SMS: ', err);
              } else {
                console.log(resp, 'response');
              }
            });
        } else {
          console.log(`I ain't sorry!! Nope!!!!`);
          game.smsNums.forEach((num, index) => {
            if (index === 0) { num.smsNum = num.smsNum.slice(2); }
            client.sendMessage({
              to: `+1${num.smsNum}`,
              from: process.env.TWILIO_NUM,
              body: `Hey, sorry the ${game.sport} game you wanted to play at ${time.getHours() > 12 ? time.getHours() - 12 + 1: time.getHours()}:00 didn't get enough players. Feel free to try back another time.`
            }, (err, resp) => {
              if (err) {
                console.error('Error sending SMS: ', err);
              } else {
                console.log(resp, 'response');
              }
            });
          })
        }
      });
    }
  });
})



