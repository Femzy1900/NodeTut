const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful!!');
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.insertMany(tours);
    console.log('Data Successfully Loaded');
  } catch (err) {
    console.log(err);
  }
};

//DELETE DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully Deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
