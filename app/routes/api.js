var User = require('../models/user');

module.exports = (router) => {
  router.get('/home', (req, res) => {
    res.send('Home page');
  });

  router.get('/', (req, res) => {
    res.send('Hello World');
  });

  router.get('/users', (req, res) => {
    User.find()
      .then((users) => {
        res.send(users);
      })
      .catch((error) => {
        res.send(error);
      });
  });

  router.delete('/users', (req, res) => {
    User.deleteOne({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    })
      .then(() => {
        User.find().then((users) => {
          res.send(users);
        });
      })
      .catch((error) => {
        res.send(error);
      });
  });

  // User Registration
  router.post('/users', (req, res) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (
      req.body.username == null ||
      req.body.username == '' ||
      req.body.email == null ||
      req.body.email == '' ||
      req.body.password == null ||
      req.body.password == ''
    ) {
      res.json({
        success: false,
        msg: 'Fields required',
      });
    } else {
      user.save((error) => {
        if (error) {
          res.json({
            success: false,
            msg: 'Username or Email already exists!',
          });
        } else {
          res.json({
            password: user.password,
            success: true,
            msg: 'User created',
          });
        }
      });
    }
  });

  // User Login
  router.post('/authenticate', function (req, res) {
    User.findOne({ username: req.body.username })
      .select('email username password')
      .exec(function (err, user) {
        if (err) {
          console.log(err);
          res.json({ success: false, msg: err });
        } else {
          if (!user) {
            res.json({
              success: false,
              message: 'Could not authenticate user',
            });
          } else if (user) {
            if (req.body.password) {
              var validPassword = user.comparePassword(req.body.password);
              //res.send(console.log(validPassword));
              if (!validPassword) {
                res.json({ success: false, msg: 'Wrong credentials' });
                return;
              } else {
                res.json({ success: true, msg: 'Successfully logged in' });
                return;
              }
            } else {
              res.json({ success: false, msg: 'No password provided' });
              return;
            }
          }
        }
      });
  });

  return router;
};
