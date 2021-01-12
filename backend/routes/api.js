var Case = require('../db/models/case.js');
var List = require('../db/models/list');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
var secret = 'secret';
var mongoose = require('mongoose');

module.exports = (router) => {
  // router.get('/cases', (req, res) => {
  //   Case.find()
  //     .then((case_list) => {
  //       res.json({
  //         case_list: case_list,
  //         msg: 'Success',
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // });

  router.get('/cases/query=:query/', (req, res) => {
    var query = req.params.query;
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    Case.find({ $text: { $search: query } })
      .select({ title: 1, judgement: 1, _id: 1 })
      .lean()
      .sort()
      .then((case_list) => {
        const resultCases = case_list.slice(startIndex, endIndex);
        res.json({
          case_list: resultCases,
          result_count: case_list.length,
          msg: 'Success',
        });
      })
      .catch((error) => console.log(error));
  });

  router.get('/cases/_id=:object_id', (req, res) => {
    Case.find({ _id: mongoose.Types.ObjectId(req.params.object_id) })
      .then((case_item) => {
        res.json({
          case_list: case_item,
          msg: 'Success',
        });
      })
      .catch((error) => console.log(error));
  });

  router.post('/cases', (req, res) => {
    var case_item = new Case();
    case_item.url = req.body.url;
    case_item.source = req.body.source;
    case_item.petitioner = req.body.petitioner;
    case_item.respondent = req.body.respondent;
    case_item.date = req.body.date;
    case_item.month = req.body.month;
    case_item.year = req.body.year;
    case_item.doc_author = req.body.doc_author;
    case_item.bench = req.body.bench;
    case_item.judgement = req.body.judgement;
    case_item.judgement_text = req.body.judgement_text;
    case_item.title = req.body.title;
    case_item.petitioner_counsel = req.body.petitioner_counsel;
    case_item.respondent_counsel = req.body.respondent_counsel;
    case_item.provisions_referred = req.body.provisions_referred;
    case_item.cases_referred = req.body.cases_referred;
    case_item.save((error) => {
      if (error) {
        res.json({
          success: false,
          msg: error,
        });
      } else {
        res.json({
          success: false,
          case_item: case_item,
          msg: 'Case created',
        });
      }
    });
  });

  router.delete('/SCdata01', (req, res) => {
    Case.deleteOne({
      url: req.body.url,
    })
      .then(() => {
        Case.find().then((case_list) => {
          res.send(case_list);
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
