const pgp = require('pg-promise')({
  capSQL: true // generate capitalized SQL 
});

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'amazon_reviews',
  user: 'postgres'
};

const db = pgp(cn); // database object

module.exports = db;