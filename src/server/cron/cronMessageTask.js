import mongoose from 'mongoose';
import Game from '../games/gameModel';
import twilio from 'twilio';
import moment from 'moment';

const cron = require('node-cron');
let time = new Date();
let checkTime = `${time.getFullYear()}-0${time.getMonth()+1}-${time.getDate()}T${time.getHours()+7}:00:00.000Z`

cron.schedule('* * * * * *', () => {
  console.log(checkTime, 'check time')
  Game.find({ 'startTime': checkTime }, 'smsNums', (err, games) => {
    if (err) {
      console.error(err, 'Error');
    } else {
      console.log(games, 'Games')
    }
  });
})






// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// cron.schedule('* * * * * *', () => {
//   let time = new Date();

//   client.sendMessage({
//     to: `+${process.env.TEST_NUM}`,
//     from: process.env.TWILIO_NUM,
//     body: `It's ${moment(time).format('llll')} right now.`
//   }, (err, resp) => {
//     if (err) {
//       console.error('Error sending SMS: ', err);
//     } else {
//       console.log(resp, 'response');
//     }
//   });
// })

