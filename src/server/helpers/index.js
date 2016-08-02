import moment from 'moment';

const helpers = {
  createGameTime: (reqTime) => {
    let gameTime = new Date(2016, 8, 2, parseInt(reqTime));
    return gameTime;
  },
};

export default helpers;