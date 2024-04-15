'use strict';

const express = require('express');
const router = express.Router();

const DBService = require('./database').projects;

/* Creation endpoint */
router.post('/create', async (req, res) => {
  //TODO: check user is authenticated
  //TODO: get the pictures from user
  const {
    title,
    short_description,
    full_description,
    keywords
  } = req.body;

  const projectId = await DBService.createProject(
    title, short_description,
    full_description,
    keywords
  );

  res.status(200).json({
    'id': projectId
  });
});

module.exports = router;
