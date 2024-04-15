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

/**
 * Project management service
 */
module.exports.projects = {
  createProject,
};

async function createProject(
  title,
  short_description,
  full_description,
  keywords,
  /* pictures */
) {
  //Handle case where the project has no keywords
  if (!keywords) {
    keywords = [];
  }

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