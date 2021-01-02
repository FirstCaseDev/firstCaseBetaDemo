var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var port = 3000;
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
require('dotenv/config');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Database connected!');
    }
  }
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, () => console.log('Server started on ' + port));
