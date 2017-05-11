import twilio from 'twilio';
import moment from 'moment';

const cron = require('node-cron');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

cron.schedule('* * * * * *', () => {
  let time = new Date();

  client.sendMessage({
    to: `+${process.env.TEST_NUM}`,
    from: process.env.TWILIO_NUM,
    body: `It's ${moment(time).format('llll')} right now.`
  }, (err, resp) => {
    if (err) {
      console.error('Error sending SMS: ', err);
    } else {
      console.log(resp, 'response');
    }
  });
})