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
    // check if game exists in DB
    db.getGame(newGame)
      .then(foundGame => {
        if (foundGame) {
          console.log('game found ', foundGame);
          foundGame.playRequests += 1
          return Promise.resolve(foundGame);
        } else {
          console.log('game not found. using newGame ', newGame);
          return Promise.resolve(newGame);
        }
      })
      .then(game => {
        // check if playRequest > minPlayer
        console.log('player Count: ', game.playRequests);
        if (helpers.hasEnoughPlayers(game)) {
          sms.sendScheduledGame({
            smsNum: gameReq.smsNum,
            sport: gameReq.sport,
            gameLoc: 'Stallings',
            gameTime: gameReq.time
          });
        }
        return Promise.resolve(game);
      })  
      .then(db.saveGame)
      .then((savedGame) => {
        let gameTime = moment(savedGame.startTime).format('LLLL');
        console.log('game saved. game time at ', gameTime);
        res.status(201).json({gameTime: gameTime});
      })
      .catch(err => {
        console.error('error saving game ', err)
        res.status(500).send('error requesting game');
      });

    
  }
}