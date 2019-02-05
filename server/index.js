require('newrelic');
const {pool, retrieve} = require('../database/index');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3006;
const {retrieveData, getStarData, getReviewData, getFeatureData} = require('./getReviews.js');
const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/reviews/:productId', retrieveData);

app.get('/reviews/:productId', getStarData, (req, res, next) => {
   if (req.query.reviewType === 'summary') {
     res.status(200).send(res.starData);
   }
   next();
 });

app.get('/reviews/:productId', getReviewData, getFeatureData, (req, res) => {
  let {starData, reviewData, featureData, keywords} = res;
  (req.query.reviewType === 'summary')
  ? res.status(200).send({starData})
  : res.status(200).send({starData, reviewData, featureData, keywords});
});

app.post('/reviews/:productId', (req, response) => {
  const values = [
    req.body.headline,
    req.body.body,
    req.body.stars,
    req.body.posted,
    req.body.helpful,
    req.body.verified,
    req.body.author_id,
    req.params.product_id
  ];
  // console.log(values);
  let sql = 'INSERT INTO reviews(headline, body, stars, posted, helpful, verified, author_id, product_id) values($1, $2, $3, $4, $5, $6, $7, $8)';
  pool(sql, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    }
    console.log(res);
    response.status(201).send('Product review inserted', res.rows[0]);
  })
})

app.put('/reviews/:productId', (req, response) => {
  const data = {
    body: req.body.body,
    product_id: req.params.productId,

  };
  const values = [
    data.body,
    data.product_id,
  ];
  let sql = 'UPDATE review SET body = $1 WHERE product_id = $2';
  pool(sql, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    }
    response.status(200).send('Product review updated', res.rows[0]);
  })
})

app.delete('/reviews/:productId', (req, response) => {
  const data = {
    reviewId: req.body.reviewId,
    product_id: req.params.productId,
  };
  const values = [
    data.reviewId,
    data.product_id,
  ]
  let sql = 'DELETE FROM reviews WHERE id = $1 product_id = $2';
  pool(sql, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    }
    response.status(204).send('Product review removed', res.rows[0]);
  })
})

app.listen(port, (err) => {
  if (err) {
    console.log('Server connection failed');
    throw err;
  }
  console.log('Now listening on port ' + port);
});
