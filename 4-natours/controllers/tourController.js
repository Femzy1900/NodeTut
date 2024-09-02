const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Routes
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  // res.status(200).json({
  //   status: 'success',
  //   result: tours.length,
  //   requestedAt: req.requestTime,
  //   data: {
  //     tours
  //   }
  // });
};

exports.createTour = async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // const tour = tours.find(el => el.id === id);

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
