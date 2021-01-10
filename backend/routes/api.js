var List = require('../db/models/list');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
var secret = 'secret';

module.exports = (router) => {
  router.get('/home', (req, res) => {
    List.find().then((list) => {
      res.json({
        list: list,
        msg: 'Success',
      });
    });
  });

  router.post('/home', (req, res) => {
    var list = new List();
    list.idx = req.body.idx;
    list.name = req.body.name;
    list.age = req.body.age;
    list.gender = req.body.gender;
    list.country = req.body.country;
    list.save((error) => {
      if (error) {
        res.json({
          success: false,
          msg: error,
        });
      } else {
        res.json({
          success: false,
          list: list,
          msg: 'List created',
        });
      }
    });
  });

  router.delete('/home', (req, res) => {
    List.deleteOne({
      _id: req.body._id,
    })
      .then(() => {
        List.find().then((list) => {
          res.send(list);
        });
      })
      .catch((error) => {
        res.send(error);
      });
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

  // // Data Receive
  // router.get('/search', (req, res) => {
  //   if (
  //     req.body.source != null ||
  //     req.body.title != null ||
  //     req.body.petitioner != null ||
  //     req.body.respondent != null ||
  //     req.body.doc_author != null
  //   ) {
  //     Case.find({
  //       source: req.body.source,
  //       title: req.body.title,
  //       petitioner: req.body.petitioner,
  //       respondent: req.body.respondent,
  //       doc_author: req.body.doc_author,
  //     })
  //       .then((cases) => {
  //         if (cases == null) {
  //           res.json({ status: true, msg: 'No case found', count: 0 });
  //         } else {
  //           res.json({
  //             status: true,
  //             msg: 'Case(s) found',
  //             count: cases.length(),
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         res.json({ status: false, msg: err });
  //       });
  //   }
  // });

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
                var token = jwt.sign(
                  { username: user.username, email: user.email },
                  secret,
                  { expiresIn: '1h' }
                );
                res.json({
                  success: true,
                  msg: 'Successfully logged in',
                  token: token,
                });
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

  router.use(function (req, res, next) {
    var token =
      req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          res.json({ success: false, msg: 'Invalid Token' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res, json({ success: false, msg: 'No token provided' });
    }
  });

  router.post('/me', (req, res) => {
    res.send(req.decoded);
  });

  return router;
};
