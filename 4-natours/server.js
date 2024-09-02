const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: "The Testing the hiker",
  price: 500,
  rating: 4.6
})

const app = require('./app');

// SERVER PORT
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
