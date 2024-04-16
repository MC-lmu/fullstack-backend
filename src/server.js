'use strict';

const PORT = process.env.PORT;

const HTTPErrors = require('http-errors');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

/* Create routes */
const apiRouter = express.Router();
apiRouter.use('/projects', require('./projects'));

app.use('/api/v1', apiRouter);

/* Test endpoint */
app.get('/', (req, res) => {
  res.status(200).send('hello!\n');
});

/* Exception handlers */
app.use((err, req, res, next) => {  //Handler for http-errors exceptions
  if (!HTTPErrors.isHttpError(err)) {
    return next(err);
  }

  console.error(`http-errors object: STATUS=${err.status} MESSAGE='${err.message}'`);
  console.error(`Error stack: ${err.stack}`);

  res.status(err.status).json({
    'message': err.message
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {  //Generic exception handler
  console.error('UNHANDLED EXCEPTION:');
  console.error(err.stack);

  res.status(500).json({
    'message': 'An unknown server error occured'
  });
});

/* Connect to database and start server */
const databaseClient = require('./database').getClient();
databaseClient.connect()
  .then(() =>
  {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((reason) =>
  {
    console.log('Failed to connect to database!');
    console.log('Reason: ' + reason);
  });