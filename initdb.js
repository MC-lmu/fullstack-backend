
const client = require('./src/database').getClient();

client.connect()
  .then(async () =>
  {
    // eslint-disable-next-line quotes
    client.query('\
    CREATE TABLE IF NOT EXISTS projects\
    (\
        id bigserial PRIMARY KEY,\
        title character varying(255),\
        intro character varying(80),\
        description text,\
        keywords character varying(60)[],\
        thumbnail_url text,\
        illustration_urls text[]\
    )').then(() => {
      console.log('Database initialized successfully!');
      process.exit(0);
    });
  }).catch((reason) => {
    console.error('Failed to connect to the database.');
    console.error('Reason: ' + reason);
    process.exit(1);
  });
