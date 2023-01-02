const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE;

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception -- Shutting Down.');
  process.exit(1);
});

mongoose
  .set('strictQuery', false)
  .connect(DB)
  .then(() => console.log('DB connection success...'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection -- Shutting Down.');
  server.close(() => {
    process.exit(1);
  });
});
