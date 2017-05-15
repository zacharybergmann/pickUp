require('dotenv').config();

import sms from '../twilio/sms';
import Game from './gameModel';
import db from '../mongoose/db';
import helpers from '../helpers';
import moment from 'moment';
import geocoder from 'geocoder';
import axios from 'axios';

export default {
  addRequest: (req, res, next) => {
    let gameReq = req.body;
    console.log(gameReq, 'game request');
    let smsNum = helpers.phone(gameReq.smsNum);
    // TODO: james refactor
    if (typeof gameReq.address !== 'string') {
      gameReq.address = gameReq.address.formatted_address;
    }
    geocoder.geocode(gameReq.address, function (err, data) {
      if (err) {
      } else {
        let address = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        };
        if (!smsNum) {
          return res.send(400);
        }
        let newGame = new Game({
          sport: gameReq.sport,
          startTime: gameReq.time,
          location: 'Stallings',
          minPlayers: 2,
          playRequests: 1,
          smsNums: [{ smsNum: smsNum, address: address }],
        });
        // check if game exists in DB
        db.getGame(newGame)
          .then(foundGame => {
            if (foundGame) {
              if (helpers.includesPlayer(foundGame, gameReq.smsNum)) {
                return Promise.resolve(foundGame);
              }
              foundGame.smsNums.push({ smsNum: gameReq.smsNum, address: address });

              foundGame.playRequests += 1
              return Promise.resolve(foundGame);
            } else {
              return Promise.resolve(newGame);
            }
          })
          .then(game => {
            if (helpers.hasEnoughPlayers(game)) {
              //combine locations to find central playing field.
              let newLocation = (game) => {
                let lngs = 0;
                let lats = 0;
                helpers.findCentralLocation(game, (loc) => {
                  lngs += loc.lng;
                  lats += loc.lat;
                });
                return (`${lngs / game.playRequests},${lats / game.playRequests}`);
              }
              let setLocation = newLocation(game);
              let reverseStringCoords = (str) => str.split(',').reverse().join();
              let revCoords = reverseStringCoords(setLocation);
              let config = {
                params: {
                  'location': revCoords, //30.03158509999999,-90.02438749999999,
                  'radius': '500',
                  'type': 'park',
                  'key': process.env.GOOGLE_GEOCODE_API
                }
              }
              axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', config)
                .then((resp) => {
                  console.log(resp, 'resp from google axios request')
                  let RESPONSEName = '';
                  if(resp.data.results.length > 0 && typeof resp.data.results[0].geometry === 'object' && resp.data.results[0].name !== '') {
                    console.log('inside of the IF');
                    RESPONSEName = resp.data.results[0].name;
                    let nearestParkCoords = `${resp.data.results[0].geometry.location.lng},${resp.data.results[0].geometry.location.lat}`;
                    setLocation = nearestParkCoords;
                  }
                  setLocation = helpers.reverseGeocode(setLocation, (midAddress) => {
                    helpers.forEachPlayer(game, (num) => {
                      sms.sendScheduledGame({
                        smsNum: num,
                        sport: gameReq.sport,
                        gameLoc: `${RESPONSEName}-${midAddress}`,
                        gameTime: moment(gameReq.time)
                      });
                    })
                  });
                });
            }
            return Promise.resolve(game);
          })
          .then(db.saveGame)
          .then((savedGame) => {
            res.status(201).json(savedGame);
          })
          .catch(err => {
            console.error('error saving game ', err)
            res.status(500).send('error requesting game');
          });
      }
    })
  },


  addGameTextMode(gameReq, address, smsNum, res) {
    let newGame = new Game({
      sport: gameReq.sport,
      startTime: gameReq.time,
      location: 'Stallings',
      minPlayers: 2,
      playRequests: 1,
      smsNums: [{ smsNum: smsNum, address: address }],
    });
    // check if game exists in DB
    db.getGame(newGame)
      .then(foundGame => {
        if (foundGame) {
          if (helpers.includesPlayer(foundGame, gameReq.smsNum)) {
            return Promise.resolve(foundGame);
          }
          foundGame.smsNums.push({ smsNum: gameReq.smsNum, address: address });

          foundGame.playRequests += 1
          return Promise.resolve(foundGame);
        } else {
          return Promise.resolve(newGame);
        }
      })
      .then(game => {
        if (helpers.hasEnoughPlayers(game)) {
          //combine locations to find central playing field.
          let newLocation = (game) => {
            let lngs = 0;
            let lats = 0;
            helpers.findCentralLocation(game, (loc) => {
              lngs += loc.lng;
              lats += loc.lat;
            });
            return (`${lngs / game.playRequests},${lats / game.playRequests}`);
          }
          let setLocation = newLocation(game);
          let reverseStringCoords = (str) => str.split(',').reverse().join();
          let revCoords = reverseStringCoords(setLocation);
          let config = {
            params: {
              'location': revCoords, //30.03158509999999,-90.02438749999999,
              'radius': '500',
              'type': 'park',
              'key': process.env.GOOGLE_GEOCODE_API
            }
          }
          axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', config)
            .then((resp) => {
              console.log(resp, 'resp from google axios request')
              let RESPONSEName = '';
              if(resp.data.results.length > 0 && typeof resp.data.results[0].geometry === 'object' && resp.data.results[0].name !== '') {
                console.log('inside of the IF');
                RESPONSEName = resp.data.results[0].name;
                let nearestParkCoords = `${resp.data.results[0].geometry.location.lng},${resp.data.results[0].geometry.location.lat}`;
                setLocation = nearestParkCoords;
              }
              setLocation = helpers.reverseGeocode(setLocation, (midAddress) => {
                helpers.forEachPlayer(game, (num) => {
                  sms.sendScheduledGame({
                    smsNum: num,
                    sport: gameReq.sport,
                    gameLoc: `${RESPONSEName}- ${midAddress}`,
                    gameTime: moment(gameReq.time)
                  });
                })
              });
            });  
        }
        return Promise.resolve(game);
      })
      .catch(err => sms.sendError(num, 'Sorry, your address was unable to be resolved. Please try again with a different local address.'))
      .then(db.saveGame)
      .then((savedGame) => {
        res.status(201).json(savedGame);
      })
      .catch(err => {
        console.error('error saving game ', err)
        res.status(500).send('error requesting game');
      });
  }
}
