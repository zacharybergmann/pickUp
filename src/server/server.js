import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import gameController from './games/gameController';
import db from './mongoose/dbConnect';
import cronMsg from './cron/cronMessageTask';
import cronDel from './cron/cronDeleteTask';

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
  // use req.body.Body    , proven valid to get message text message from user
  console.log(req.body.Body, 'this is req from twilio');
  const twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

export default app;