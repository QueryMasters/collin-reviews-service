const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  password: 'pg;def9012!',
  host: 'localhost',
  database: 'postgres',
  port: 5432
})

// const mysql = require('mysql');
// const db = mysql.createConnection({
//   // host: '172.17.0.2',
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'amazon_reviews'
// });

console.log('Attempting to connect...')
pool.connect(err => {
  // db.connect((err) => {
  if (err) {
    console.log('Connection failed', err)
  } else {
    console.log('Connection successful')
  }
})

//Takes an object stating the search criteria
const retrieve = (productId, type, callback) => {
  //product id as search criteria

  // for mysql
  // let qComplete = `SELECT revs.*, media.file AS media,
  //                  features.feature, features.rating AS featureRating,
  //                   authors.username, authors.avatar
  //                   FROM (SELECT products.name AS productName,
  //                   reviews.* FROM products, reviews
  //                   WHERE products.id = reviews.product_id
  //                   AND reviews.product_id = ?) revs
  //                   JOIN authors ON authors.id = revs.author_id
  //                   LEFT JOIN media ON media.review_id = revs.id
  //                   LEFT JOIN features ON features.product_id = revs.product_id
  //                   ORDER BY revs.helpful DESC;
  //   `;

  // for psql
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
    `
  let qSummary = 'SELECT * FROM reviews WHERE id = $1;'
  let query = type === 'summary' ? qSummary : qComplete
  // db.query(query, productId, (err, results) => {
  pool.query(query, [productId], (err, results) => {
    if (err) {
      throw err
    }
    console.log('Query successful')
    // callback(null, results);
    callback(null, results.rows)
  })
}

// exports.db = db;
module.exports = {
  pool: (query, values, callback) => {
    return pool.query(query, values, callback)
  },
  retrieve: retrieve
}
