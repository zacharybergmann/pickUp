import sms from '../twilio/sms';
import Game from './models/game';
import db from '../mongoose/db';

export default {
  addRequest: (req, res, next) => {
    let gameReq = req.body;
    console.log(gameReq);
    
    let newGame = new Game({
      sport: gameReq.sport,
      startTime: gameReq.time,
      location: 'Stallings',
      minPlayers: 6,
      playRequests: 1
    });

    db.saveGame(newGame)
      .then((game) => {
        console.log('game saved', game);
      });

    sms.sendScheduledGame({
      smsNum: gameReq.smsNum,
      sport: gameReq.sport,
      gameLoc: 'Stallings',
      gameTime: gameReq.time
    });

    res.status(201).send('requst added');
  }
}