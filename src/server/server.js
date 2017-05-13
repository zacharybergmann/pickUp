import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import gameController from './games/gameController';
import sms from './twilio/sms';
import db from './mongoose/dbConnect';
import cronMsg from './cron/cronMessageTask';
import cronDel from './cron/cronDeleteTask';

const chrono = require('chrono-node');
const twilio = require('twilio');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

const sports = ['soccer', 'basketball', 'baseball', 'football', 'volleyball'];

const app = express();
let clientDir = path.join(__dirname, '../../src/client')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(clientDir));

app.post('/api/games', gameController.addRequest)
console.log(`client directory: ${clientDir}`)

app.post('/sms', (req, res) => {
  const phoneNum = req.body.From;
  console.log(req.body.From, 'body of request');
  console.log(req.body.Body, 'this is req from twilio');
  const mes = req.body.Body;
  const date = chrono.parseDate(req.body.Body);
  if(date === null) {
    sms.sendError(phoneNum, 'Sorry, we were unable to understand the date/time for your event. Please send a new request.');
    //send message with Twilio back to user for failed attempt handling date!
    return;
  }
  axios.get(`http://geocoder.ca/${req.body.Body}?json=1?auth=10301591512318965`).then(resp => {
    if(resp.error) {
      sms.sendError(phoneNum, 'Sorry, we were unable to understand the address for your event. Please send a new request.')
      return;
    }
    // this is format of resp.data
    // { standard:
    //   { staddress: 'I Want To Play Soccer Today At I Live At 748 Camp',
    //     stnumber: '6',
    //     postal: '70115',
    //     street1: 'I WANT TO PLAY SOCCER TODAY AT 6PM. I LIVE  ',
    //     city: 'New Orleans',
    //     prov: 'LA',
    //     street2: '748 CAMP ST  ',
    //     confidence: '0.8'
    //   },
    //   longt: '-90.084453',
    //   TimeZone: 'America/Chicago',
    //   AreaCode: '504',
    //   latt: '29.926336' 
    // }
    const longitude = resp.data.longt;
    const lattitude = resp.data.latt;

    // last step, determine if we can access our sport in the natural text...split text on spaces and see if any stored sports are in this group
    const sportConfidence = [];
    sports.forEach(sport => {
      sportConfidence.push({
        sport: sport,
        confidence: stringSimilarity.findBestMatch(sport, mes.split(' ')).bestMatch.rating,
      });
    });
    console.log(sportConfidence, 'sport confidence array');
    const mostLikelySport = sportConfidence.reduce((bestSoFar, sportObj) =>
      bestSoFar === null || sportObj.confidence > bestSoFar.confidence ? sportObj : bestSoFar
    , null);
    console.log(mostLikelySport, 'the most likely sport we have');
    // const matches = stringSimilarity.findBestMatch('soccer', mes.split(' '));
    // console.log(matches.bestMatch, 'this is match confidence of best match');
    if(mostLikelySport.confidence < 0.70) {
      sms.sendError(phoneNum, 'Sorry, we were unable to understand the sport that you want to play. Please send a new request.')
      res.send(400);
      return;
    }
    //call a function to add this all to DB!
    sms.sendError(phoneNum, 'Congratulations, you have been added to the game queue. We will let you know when your game is ready!');
    res.send(200);
  }); 
});

export default app;
