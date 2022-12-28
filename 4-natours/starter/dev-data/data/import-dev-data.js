const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModels');

const DB = process.env.DATABASE;

mongoose
  .set('strictQuery', false)
  .connect(DB)
  .then(() => console.log('DB connection success...'));

// read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded! 🟢');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted! 🟥');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
