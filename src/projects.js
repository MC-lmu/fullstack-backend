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
    intro,
    description,
    thumbnail_url,
    keywords,
    illustration_urls
  } = req.body;

  if (!title) {
    return next(httpErrors.BadRequest('Missing parameter \'title\''));
  } else if (!intro) {
    return next(httpErrors.BadRequest('Missing paramter \'intro\''));
  } else if (!description) {
    return next(httpErrors.BadRequest('Missing parameter \'description\''));
  } else if (!thumbnail_url) {
    return next(httpErrors.BadRequest('Missing parameter \'thumbnail_url\''));
  }

  const projectId = await DBService.createProject(
    title, intro, description, keywords,
    thumbnail_url, illustration_urls
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

/* Update endpoint */
router.patch('/:id', async (req, res, next) => {
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
    return next(httpErrors.BadRequest('Invalid parameter \':id\''));
  }

  if (!await DBService.updateProject(projectId, req.body)) {
    return next(httpErrors.NotFound());
  }

  return res.send();
});

/* Delete endpoint */
router.delete('/:id', async (req, res, next) => {
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
    return next(httpErrors.BadRequest('Invalid parameter \':id\''));
  }

  if (!await DBService.deleteProject(projectId)) {
    return next(httpErrors.NotFound());
  }

  return res.send();
});

module.exports = router;
