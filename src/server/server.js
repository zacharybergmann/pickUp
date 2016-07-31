import express from 'express';
import morgan from 'morgan';
import path from 'path';

const app = express();
let clientDir = path.join(__dirname, '../../src/client')

app.use(morgan('dev'));
app.use(express.static(clientDir));
console.log(`client directory: ${clientDir}`)

export default app;