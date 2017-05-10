import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  smsNum: 'string',
   address: 'string',
});

export default userSchema;