import sms from '../twilio/sms';
import Game from './models/game';
import db from '../mongoose/db';
import helpers from '../helpers';
import moment from 'moment';

export default {
  addRequest: (req, res, next) => {
    let gameReq = req.body;
    console.log(gameReq);
    
    let newGame = new Game({
      sport: gameReq.sport,
      startTime: helpers.createGameTime(gameReq.time),
      location: 'Stallings',
      minPlayers: 6,
      playRequests: 1
    });

    db.saveGame(newGame)
      .then((game) => {
        let gameTime = moment(game.startTime).format('LLLL');
        console.log('game saved. game time at ', gameTime);
        res.status(201).json({gameTime: gameTime});
      })
      .catch(err => {
        console.error(err)
        res.status(500).send('error requesting game');
      });

    sms.sendScheduledGame({
      smsNum: gameReq.smsNum,
      sport: gameReq.sport,
      gameLoc: 'Stallings',
      gameTime: gameReq.time
    });

  }
}