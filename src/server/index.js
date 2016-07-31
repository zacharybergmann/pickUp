import express from 'express';
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`pickUp listening on port: ${process.env.PORT}!`);
});