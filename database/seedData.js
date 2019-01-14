const Promise = require('bluebird');
const faker = require('faker');
const db = Promise.promisifyAll(require('./index').db);
const request = require('request');
const fs = Promise.promisifyAll(require('fs'));

let NUM_PRODUCTS = 100;
let NUM_AUTHORS = 100;
let NUM_REVIEWS = 200;
let NUM_FEATURES = 10;
let NUM_MEDIA = 50;

let getRandomInt = function(start, stop) {
  return Math.floor((Math.random() * (stop - start)) + start);
};
 
let getRandomDouble = function(start = 0, stop = 5) {
  return ((Math.random() * (stop - start)) + start).toFixed(1);
};

let getGibberish = () => {
  return new Promise((resolve, reject) => {
    let numPara = getRandomInt(1, 4);
    let minWords = getRandomInt(1, 20);
    let maxWords = getRandomInt(20, 100);
    // console.log('RRRRRR', `http://www.randomtext.me/api/gibberish/p-${numPara}/${minWords}-${maxWords}`);
    request(`http://www.randomtext.me/api/gibberish/p-${numPara}/${minWords}-${maxWords}`, 
    (err, response) => {
      if (err) reject(err);
      let res = JSON.parse(response.body);
      resolve(res);
    });
  });
};

let getImages = () => {
  return fs.readdirAsync(__dirname + '/images') 
    .then(files => {
      // console.log('getimages GOT IMAGES', files);
      return files;
    })
    .catch(err => {
      throw err;
    });
};

let generateProducts = function(num = NUM_PRODUCTS) {
  return Array.from({length: num},
    p => [faker.commerce.productName()]);
};

let generateAuthors = function(num = NUM_AUTHORS) {
  return Array.from({length: num}, a => {
    return [
      faker.internet.userName(),
      faker.internet.avatar()
    ];
  });
};

let generateReviews = function(num = NUM_REVIEWS) {
  return Promise.all(Array.from({length: num}, r => {
    return getGibberish()
      .then(gibberish => {
        return [
          faker.company.catchPhrase(), //headline
          gibberish.text_out, //body
          getRandomInt(1, 6), //stars
          faker.date.past().toISOString().split('T')[0], //date
          getRandomInt(0, 1500), //helpful
          faker.random.boolean(), //verified
          getRandomInt(1, NUM_AUTHORS + 1), //author
          getRandomInt(1, NUM_PRODUCTS + 1) //product
        ]
      })
      .catch(err => {
        console.log('ERROR GENERATING REVIEWS', err);
      });
  }));
};

let generateFeatureRatings = function(num = NUM_FEATURES) {
  return Array.from({length: num}, r => {
    return [
      faker.commerce.productAdjective(), //feature
      getRandomDouble(), //overall rating
      getRandomInt(0, 1000), //count: how many total votes cast
      getRandomInt(1, NUM_PRODUCTS) //product
    ];
  });
};

let generateMedia = function(num = NUM_MEDIA) {
  return getImages()
    .then(images => {
      //console.log('GOT IMAGES', images);
      return Array.from(images, img => {
        return [
          'photo', //type
          img, //file
          getRandomInt(1, NUM_REVIEWS) //review
        ];
      });
    })
    .catch(err => {
      throw err;
    });
};

let products = generateProducts();
let authors = generateAuthors();
let features = generateFeatureRatings();

let mysqlReady = (arr) => {
  return arr.map(i => {
    return `(${['default'].concat(i.map(e => JSON.stringify(e))).join(',')})`;
  }).join(',');
};

let qProducts = `INSERT INTO products VALUES ${mysqlReady(products)}`;
let qAuthors = `INSERT INTO authors VALUES ${mysqlReady(authors)}`;
let qFeatures = `INSERT INTO features VALUES ${mysqlReady(features)}`;

console.log('LETS GENERATE REVIEWS');

let qReviews = generateReviews()
  .then(reviews => {
    return `INSERT INTO reviews VALUES ${mysqlReady(reviews)}`;
  })
  .catch(err => {
    throw err;
  });

console.log('LETS GENERATE MEDIA');

let qMedia = generateMedia()
  .then(media => {
    return `INSERT INTO media VALUES ${mysqlReady(media)}`;
  })
  .catch(err => {
    throw err;
  });

console.log('ABOUT TO ASYNC');

db.queryAsync(qProducts)
  .then(ok => {
    console.log('done with products!');
    return db.queryAsync(qAuthors);
  })
  .then(ok => {
    console.log('done with authors!');
    return qReviews
      .then(query => {
        db.queryAsync(query);
      });
  })
  .then(ok => {
    console.log('done with reviews!');
    return Promise.all([
      db.queryAsync(qFeatures),
      qMedia
        .then(query => {
          db.queryAsync(query);
        })
    ]);
  })
  .then(ok => {
    console.log('done with feature ratings, media!')
    db.end();
  })
  .catch(err => {
    console.log('caught', err);
    db.end();
  });

  