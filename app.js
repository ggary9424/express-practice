const _ = require('lodash');
const path = require('path');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongoist');
const { Users } = require('./collections');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 5000);

// Process application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Process application/json
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
  const users = await Users.find({});

  return res.status(200).json(users).send();
})

app.post('/users', async (req, res) => {
  let { name, age } = req.body;

  if (!name || !age) {
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

  const _id = ObjectID();

  const result = await Users.update({
    name,
  }, {
    $setOnInsert: {
      _id,
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
