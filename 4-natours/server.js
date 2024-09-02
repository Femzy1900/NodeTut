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

const app = require('./app');

// SERVER PORT
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
