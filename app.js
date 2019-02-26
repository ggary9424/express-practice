const path = require('path');
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

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
})

app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'));
});
