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
    // console.log(gameReq);
    let smsNum = helpers.phone(gameReq.smsNum);
    // TODO: james refactor
    if (typeof gameReq.address !== 'string') {
      gameReq.address = gameReq.address.formatted_address;
    }
    geocoder.geocode(gameReq.address, function (err, data) {
      if (err) {
        // console.log("Geocode did not respond well", err);
      } else {
        let address = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        };
        // address = JSON.stringify(address);
        if (!smsNum) {
          return res.send(400);
        }
        // console.log("ADDRESS", address);
        let newGame = new Game({
          sport: gameReq.sport,
          startTime: gameReq.time,
          location: 'Stallings',
          minPlayers: 1,
          playRequests: 1,
          smsNums: [{ smsNum: smsNum, address: address }],
        });
        // check if game exists in DB
        db.getGame(newGame)
          .then(foundGame => {
            if (foundGame) {
              // console.log('game found ');
              if (helpers.includesPlayer(foundGame, gameReq.smsNum)) {
                // console.error('game already requested.');
                return Promise.resolve(foundGame);
              }
              foundGame.smsNums.push({ smsNum: gameReq.smsNum, address: address });

              foundGame.playRequests += 1
              return Promise.resolve(foundGame);
            } else {
              // console.log('game not found. using newGame ');
              return Promise.resolve(newGame);
            }
          })
          .then(game => {
            // check if playRequest > minPlayer
            // console.log('GAME is:', game);
            // console.log('player Count: ', game.playRequests);
            if (helpers.hasEnoughPlayers(game)) {
              //combine locations to find central playing field.
              let newLocation = (game) => {
                let lngs = 0;
                let lats = 0;
                helpers.findCentralLocation(game, (loc) => {
                  // console.log("LOCS INSIDE", loc);
                  lngs += loc.lng;
                  lats += loc.lat;
                });
                // console.log('AVERAGE LOCATION:', `${lngs / game.playRequests},${lats / game.playRequests}`);
                return (`${lngs / game.playRequests},${lats / game.playRequests}`);
              }
              let setLocation = newLocation(game);
              setLocation = helpers.reverseGeocode(setLocation, (midAddress) => {
                console.log('AVERAGE LOC', setLocation);
                ///////////////////////
                let reverseStringCoords = (str) => str.split(',').reverse().join();
                let revCoords = reverseStringCoords(setLocation);
                console.log(revCoords);
                let config = {
                  params: {
                    'location': revCoords, //30.03158509999999,-90.02438749999999,
                    'radius': '500',
                    'type': 'park',
                    'key': process.env.GOOGLE_GEOCODE_API
                  }
                }
                axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', config)
                  // axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${setLocation}&radius=1000&type=park&keyword=&key=AIzaSyDvobyVzg7zgmXhuQedKd1cMFkOD92RLDk')
                  .then((res) => {
                    console.log('RESPONSE', res.data.results[0], res.data.results[0].geometry);
                    let RESPONSEName = res.data.results[0].name;
                    console.log("NAME", RESPONSEName);
                    console.log('LAT TEST', res.data.results[0].geometry.location.lat, 'TYPE', typeof (res.data.results[0].geometry.location.lat));
                    let nearestParkCoords = `${res.data.results[0].geometry.location.lng},${res.data.results[0].geometry.location.lat}`;
                    console.log('NEAREST PARKS', nearestParkCoords, 'TYPE', typeof (nearestParkCoords));
                    setLocation = nearestParkCoords;
                    setLocation = helpers.reverseGeocode(setLocation, (midAddress, midAddressName) => {
                      console.log('AVEAddress:', midAddress);
                      helpers.forEachPlayer(game, (num) => {
                        // console.log('texting ', num);
                        sms.sendScheduledGame({
                          smsNum: num,
                          sport: gameReq.sport,
                          gameLoc: `${RESPONSEName}-${midAddress}`,
                          gameTime: gameReq.time
                        });
                      })
                    })
                  });

                // })
                //////////////////////////////////////////////////
                setLocation = helpers.reverseGeocode(setLocation, (midAddress, midAddressName) => {
                  console.log('AVEAddress:', midAddress);
                  helpers.forEachPlayer(game, (num) => {
                    console.log('texting ', num);
                    sms.sendScheduledGame({
                      smsNum: num,
                      sport: gameReq.sport,
                      gameLoc: `${RESPONSEName}-${midAddress}`,
                      gameTime: gameReq.time
                    });
                  })
                })
              });
              // send to all the players
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


  addGameTextMode(gameReq, address, smsNum) {
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
          console.log('game found ');

          if (helpers.includesPlayer(foundGame, gameReq.smsNum)) {
            console.error('game already requested.');
            return Promise.resolve(foundGame);
          }
          foundGame.smsNums.push({ smsNum: gameReq.smsNum, address: address });

          foundGame.playRequests += 1
          return Promise.resolve(foundGame);
        } else {
          console.log('game not found. using newGame ');
          return Promise.resolve(newGame);
        }
      })
      .then(game => {
        // check if playRequest > minPlayer
        // console.log('GAME is:', game);
        // console.log('player Count: ', game.playRequests);
        if (helpers.hasEnoughPlayers(game)) {
          //combine locations to find central playing field.
          let newLocation = (game) => {
            let lngs = 0;
            let lats = 0;
            helpers.findCentralLocation(game, (loc) => {
              console.log("LOCS INSIDE", loc);
              lngs += loc.lng;
              lats += loc.lat;
            });
            console.log('AVERAGE LOCATION:', `${lngs / game.playRequests},${lats / game.playRequests}`);
            return (`${lngs / game.playRequests},${lats / game.playRequests}`);
          }
          let setLocation = newLocation(game);
          console.log(setLocation);
          setLocation = helpers.reverseGeocode(setLocation, (midAddress) => {
            console.log("AVEAddress:", midAddress);
            helpers.forEachPlayer(game, (num) => {
              console.log('texting ', num);
              sms.sendScheduledGame({
                smsNum: num,
                sport: gameReq.sport,
                gameLoc: midAddress,
                gameTime: gameReq.time
              });
            })
          });
          // send to all the players


        }
        return Promise.resolve(game);
      })
      .then(db.saveGame)
      .then((savedGame) => {
        console.log('game saved!')
      })
      .catch(err => {
        console.error('error saving game ', err)
      });
  },
}
