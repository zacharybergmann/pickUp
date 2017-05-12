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
  const date = chrono.parseDate(req.body.Body);
  if(date === null) {
    sms.sendError(phoneNum, 'Sorry, we were unable to understand the date/time for your event. Please send a new request.')
    //send message with Twilio back to user for failed attempt handling date!
    return;
  }
  axios.get(`http://geocoder.ca/${req.body.Body}?json=1?auth=10301591512318965`).then(resp => {
    if(resp.error) {
      // send failure message to user regarding address being unusable
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

    console.log(date, 'date to play our game!');
    console.log(date.getHours(), 'this is the date in UTC time');

    const twiml = new twilio.TwimlResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }); 
});

export default app;
