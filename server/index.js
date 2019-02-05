const {pool, retrieve} = require('../database/index');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3006;
const {retrieveData, getStarData, getReviewData, getFeatureData} = require('./getReviews.js');

// const Promise = require('bluebird');
// Promise.promisifyAll(require('redis'));
// const client = redis.createClient();
// const getAsync = client.get.bind(client);
// const setAsync = client.set.bind(client);
const newrelic = require('newrelic');
const {cacheReviews} = require('../database/cache');

app.locals.newrelic = newrelic;
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// client.onAsync('connect', function() {
//   console.log('Redis client connected');
// });

// client.onAsync('error', function (err) {
//   console.log('Something went wrong ' + err);
// });

// setAsync('my test key', 'my test value', redis.print);
// getAsync('my test key', function (error, result) {
//     if (error) {
//         console.log(error);
//         throw error;
//     }
//     console.log('GET result ->' + result);
// });

// app.use(function(err, req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
//   return false;
// });

app.use('/reviews/:productId', retrieveData);

app.get('/reviews/:productId', getStarData, (req, res, next) => {
  if (req.query.reviewType === 'summary') {
    res.status(200).send(res.starData);
  }
  next();
});

// const getReviews = (req, res) => {
//   cacheReviews(req.params.productId, (err, data) => {
//     if (err) {
//       console.error(err)
//       return res.sendStatus(500)
//     }
//     return res.send(data)
//   })
// };

// app.get('/reviews/:productId', getStarData, getReviewData, getFeatureData, getReviews);

// app.get('/reviews/:productId', getReviews);

app.get('/reviews/:productId', getReviewData, getFeatureData, (req, res) => {
  let {starData, reviewData, featureData, keywords} = res;
  (req.query.reviewType === 'summary')
  ? res.status(200).send({starData})
  : res.status(200).send({starData, reviewData, featureData, keywords});
});

// app.get('/reviews/:productId', getReviewData, getFeatureData, (req, res) => {
//   let {starData, reviewData, featureData, keywords} = res;

//   let redisResult = client.getAsync('res');
//     if (redisResult) {
//       return res.status(200).send(redisResult);
//   }
//   client.setAsync('res', JSON.stringify(res)).then(redis.print);
//   (req.query.reviewType === 'summary')
//   ? res.status(200).send({starData})
//   : res.status(200).send({starData, reviewData, featureData, keywords});
// });

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