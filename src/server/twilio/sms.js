import twilio from 'twilio';
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const sms = {
  sendScheduledGame: ({smsNum, gameLoc, gameTime, sport}) => {
    let message = `we're playing ${sport} @ ${gameLoc} for ${gameTime}. You in?`;
    console.log('sending message: ', message);
    // real text
    // return new Promise((resolve, reject) => {
    //   client.sendMessage({
    //     to: smsNum,
    //     from: process.env.TWILIO_NUM,
    //     body: message
    //   }, (err, resp) => {
    //     if (err) {
    //       console.error('Error sending SMS: ', err);
    //       reject(err);
    //     } else {
    //       console.log(resp);
    //       resolve(resp);
    //     }
    //   });
    // });

    //test
    return new Promise((resolve, reject) => {
      resolve('message sent!');
    });
  },


};

export default sms;