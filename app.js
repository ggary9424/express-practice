const _ = require('lodash');
const path = require('path');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

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

const users = [];

app.get('/users', (req, res) => {
  return res.status(200).json(users).send();
})

app.post('/users', (req, res) => {
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

  const id = uuid();
  users.push({
    id,
    name,
    age,
  });

  return res
    .status(200)
    .json({ id })
    .send();
})

app.delete('/users', (req, res) => {
  users.splice(0, users.length);

  return res.sendStatus(204);
})

app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'));
});
