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

const app = express();
let clientDir = path.join(__dirname, '../../src/client')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(clientDir));

app.post('/api/games', gameController.addRequest)
console.log(`client directory: ${clientDir}`)

app.post('/sms', (req, res) => {
  const twilio = require('twilio');
  const parseString = require('xml2js').parseString;
  // use req.body.Body    , proven valid to get message text message from user
  //save phone number for response
  const phoneNum = req.body.From;
  console.log(req.body.From, 'body of request');
  console.log(req.body.Body, 'this is req from twilio');
  const date = chrono.parseDate(req.body.Body);
  if(date === null) {
    sms.sendError(phoneNum, 'Sorry, we were unable to understand the date/time for your event. Please send a new request.')
    //send message with Twilio back to user for failed attempt handling date!
    return;
  }
  
  console.log(date, 'date to play our game!');
  console.log(date.getHours(), 'this is the date in UTC time');
  const twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

export default app;



// curl -X POST -d scantext="The most important museums of Amsterdam are located on the Museumplein, located at the southwestern side of the Rijksmuseum." \
//         -d geojson="1" \
//         https://geocode.xyz 