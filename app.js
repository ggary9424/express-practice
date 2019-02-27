const _ = require('lodash');
const path = require('path');
const uuid = require('uuid');
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongoist');
const { Users } = require('./collections');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 5000);

app.use(session({
  secret: 'some_secret_key_here',
  resave: false,
  saveUninitialized: true,
}))

// Process application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Process application/json
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  const user = await Users.findOne({
    name,
    password,
  });

  if (!user) {
    return res.status(403).send();
  }

  const tenSeconds = 10 * 1000;
  req.session.userID = user._id;
  req.session.cookie.maxAge = tenSeconds;

  return res.status(204).send();
});

app.get('/me', async (req, res) => {
  const { userID } = req.session;

  if (!userID) {
    return res.status(403).send();
  }

  const user = await Users.findOne({
    _id: ObjectID(userID),
  });

  return res.status(200).json(user).send();
});

app.get('/users', async (req, res) => {
  const users = await Users.find({});

  return res.status(200).json(users).send();
})

app.post('/users', async (req, res) => {
  let { name, password, age } = req.body;

  if (!name || !password || !age) {
    return res.sendStatus(400);
  }

  if (_.isNaN(age)) {
    return res.sendStatus(400);
  }

  age = Number(age);

  if (!_.isInteger(age)) {
    return res.sendStatus(400);
  }

  name = String(name);
  password = String(password);

  const _id = ObjectID();

  const result = await Users.update({
    name,
  }, {
    $setOnInsert: {
      _id,
      password,
      age,
    },
  }, {
    upsert: true,
  });

  if (result.upserted) {
    return res
      .status(200)
      .json({ id: _id })
      .send();
  } else {
    return res.status(400).json({
      error: 'Duplicated user name.',
    }).send();
  }
})

app.delete('/users', async (req, res) => {
  const users = await Users.remove({});

  return res.sendStatus(204);
})

app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'));
});
