import client from 'twilio';
client(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const sms = {
  sendScheduledGame: ({smsNum, gameLoc, gameTime, sport}) => {
    let message = `we're playing ${sport} @ ${gameLoc} for ${gameTime}. You in?`;
    console.log(message);
    // client.sendMessage({
    //   to: `+1${smsNum}`,
    //   from: `+1${process.env.TWILIO_NUM}`,
    //   body: message
    // }, (err, resp) => {
    //   if (err) {
    //     console.error('Error sending SMS: ', err);
    //   } else {
    //     console.log(resp);
    //   }
    // });

  },
};

export default sms;