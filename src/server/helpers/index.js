import moment from 'moment';
import crypto from 'crypto';

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
  hasEnoughPlayers: game => game.playRequests >= game.minPlayers,
};

export default helpers;