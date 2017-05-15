require('dotenv').config();

import mongoose from 'mongoose';
import moment from 'moment';
import Game from '../games/gameModel';

const cron = require('node-cron');

cron.schedule('35 * * * *', () => {
  let time = new Date();
  let checkTime = `${time.getUTCFullYear()}-0${time.getUTCMonth()+1}-${time.getUTCDate()}T${time.getUTCHours()}:00:00.000Z`
  console.log(checkTime, 'checkTime in delete task file')
  
  Game.find({ 'startTime': checkTime }, (err, games) => {
    if (err) {
      console.error(err, 'Err');
    } else if (games.length === 0) {
      return; 
    } else {
      games.forEach(game => {
        Game.remove({ _id: game._id }, function(error, data) {
          if (error) {
             console.error(error, 'Error');
          } else {
            console.log(data, 'Data');
          }
      });
      })
    }
  });
})