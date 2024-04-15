'use strict';

const httpErrors = require('http-errors');
const express = require('express');
const router = express.Router();

const DBService = require('./database').projects;

/* Creation endpoint */
router.post('/create', async (req, res, next) => {
  //TODO: check user is authenticated
  //TODO: get the pictures from user
  const {
    title,
    short_description,
    full_description,
    keywords
  } = req.body;

  if (!title) {
    return next(httpErrors.BadRequest('Missing parameter \'title\''));
  } else if (!short_description) {
    return next(httpErrors.BadRequest('Missing paramter \'short_description\''));
  } else if (!full_description) {
    return next(httpErrors.BadRequest('Missing parameter \'full_description\''));
  }

  const projectId = await DBService.createProject(
    title, short_description,
    full_description,
    keywords
  );

  res.json({
    'id': projectId
  });
});

/* Read endpoint */
router.get('/', async (req, res) => { //List all projects
  return res.json(await DBService.listProjects());
});

router.get('/:id', async (req, res, next) => { //Get project details
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
    return next(httpErrors.BadRequest('Invalid parameter \':id\''));
  }

  const projectDetails = await DBService.getProjectDetails(projectId);
  if (!projectDetails) {
    return next(httpErrors.NotFound());
  }

  return res.json(projectDetails);
});

module.exports = router;
