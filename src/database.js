'use strict';

/**
 * Database service
 */
const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE_NAME
});

module.exports.getClient = () => client;

/**
 * Utility functions for internal usage
 */
function preprocessProjectKeywords(raw) {
  if (!raw) {
    return [];
  }

  return raw.map((kw) => String(kw).toLowerCase());
}

/**
 * Project management service
 */
module.exports.projects = {
  createProject,

  listProjects,
  getProjectDetails,

  updateProject,

  deleteProject
};

async function createProject(
  title,
  short_description,
  full_description,
  keywords,
  /* pictures */
) {
  keywords = preprocessProjectKeywords(keywords);

  const insertResult = await client.query(
    'INSERT INTO projects ' +
    '(title, short_description, full_description, keywords) ' +
    'VALUES ($1, $2, $3, $4) RETURNING id',
    [ title, short_description, full_description, keywords ]
  );

  if (insertResult.rows.length !== 1) {
    console.error('createProject: fail!');
  }

  return insertResult.rows[0].id;
}

async function listProjects() {
  const selectResult = await client.query(
    'SELECT id, title, short_description, keywords ' +
    'FROM projects ORDER BY id ASC'
  );

  if (selectResult.rows.length === 0) {
    return [];
  }

  const res = selectResult.rows.map((row) => {
    return {
      'id': row.id,
      'title': row.title,
      'short_description': row.short_description,
      'keywords': row.keywords ?? []
    };
  });

  return res;
}

async function getProjectDetails(projectId) {
  const selectResult = await client.query(
    'SELECT * FROM projects WHERE id=$1',
    [ projectId ]
  );

  if (selectResult.rows.length !== 1) {
    console.error(`cannot find project with id ${projectId}`);
    return null;
  }

  return selectResult.rows[0];
}

async function updateProject(projectId, updatedFields) {
  //Fetch existing project information
  const curProjInfo = await getProjectDetails(projectId);
  if (!curProjInfo) {
    return null;
  }

  //Overwrite fields that need to be updated
  const newProjInfo = { 'id': curProjInfo.id };
  for (const key in curProjInfo) {
    if (key === 'id')
      continue;

    newProjInfo[key] = updatedFields[key] ?? curProjInfo[key];
  }

  newProjInfo.keywords = preprocessProjectKeywords(
    newProjInfo.keywords
  );

  //Commit updated state
  const updateResult = await client.query(
    'UPDATE projects SET ' +
    'title=$2, short_description=$3, full_description=$4, ' +
    'keywords=$5 WHERE id=$1',
    [
      projectId, newProjInfo.title,
      newProjInfo.short_description,
      newProjInfo.full_description,
      newProjInfo.keywords
    ]
  );

  return updateResult.rowCount;
}

async function deleteProject(projectId) {
  const deleteResult = await client.query(
    'DELETE FROM projects WHERE id=$1',
    [ projectId ]
  );

  return deleteResult.rowCount === 1;
}