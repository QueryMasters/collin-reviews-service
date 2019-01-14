const mysql = require('mysql');
const db = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  database: 'amazon_reviews'
});

console.log('LETS CONNECT');
db.connect((err) => {
  if (err) {
    console.log('TRIED TO CONNECT BUT', err);
  } else {
    console.log('CONNECTED SUCCESSFULLY');
  }
});

//Takes an object stating the search criteria
const retrieve = (productId, type, callback) => {
  //product id as search criteria
  let qComplete = `SELECT revs.*, media.file AS media, 
    features.feature, features.rating AS featureRating,
    authors.username, authors.avatar 
  FROM (SELECT products.name AS productName,
    reviews.* FROM products, reviews 
    WHERE products.id = reviews.product_id 
    AND reviews.product_id = ?) revs 
  JOIN authors ON authors.id = revs.author_id
  LEFT JOIN media ON media.review_id = revs.id
  LEFT JOIN features ON features.product_id = revs.product_id
  ORDER BY revs.helpful DESC;
    `;
  let qSummary = 'SELECT stars FROM reviews WHERE product_id = ?';
  let query = (type === 'summary') ? qSummary : qComplete;
  db.query(query, productId, (err, results) => {
    if (err) { throw err; }
    console.log('RESULTS FROM DATABASE RETRIEVAL', results);
    callback(null, results);
  });
};

exports.db = db;
exports.retrieve = retrieve;
