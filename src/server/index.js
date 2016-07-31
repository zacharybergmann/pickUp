import app from './server';

app.listen(process.env.PORT, () => {
  console.log(`pickUp listening on port: ${process.env.PORT}!`);
});