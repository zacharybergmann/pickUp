import sms from '../twilio/sms';
import Game from './models/game';

export default {
  addRequest: (req, res, next) => {
    let gameReq = req.body;
    console.log(gameReq);
    let newGame = new Game({
      sport: gameReq.sport,
      startTime: { type: Date },
      location: 'Stallings',
      minPlayers: 6,
      playRequests: 
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