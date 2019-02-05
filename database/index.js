const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: 'amz_reviews',
  port: 5432,
});

console.log('Attempting to connect...');
pool.connect((err) => {
  if (err) {
    console.log('Connection failed', err);
  } else {
    console.log('Connection successful');
  }
});


const retrieve = (productId, type, callback) => {
    let qComplete = `SELECT 
                        revs.*, media.url,
                        features.feature, features.rating AS featureRating,
                        authors.username, authors.avatar
                    FROM 
                      (SELECT products.name,
                        reviews.* FROM products, reviews
                        WHERE 
                          products.id = reviews.product_id 
                          AND reviews.product_id = $1 limit 10) revs
                        INNER JOIN authors ON authors.id = revs.author_id
                        LEFT JOIN media ON media.review_id = revs.id
                        LEFT JOIN features ON features.product_id = revs.product_id
                    ORDER BY revs.helpful DESC;
    `;
let qSummary = 'SELECT * FROM reviews WHERE id = $1;';
let query = (type === 'summary') ? qSummary : qComplete;
  pool.query(query, [productId], (err, results) => {
console.log(typeof(Number(productId)))
    if (err) { throw err; }
    console.log('Query successful')
    callback(null, results.rows);
  });
};

module.exports = {
  pool: (query, values, callback) => {
    return pool.query(query, values, callback);
  },
    retrieve: retrieve 
}
