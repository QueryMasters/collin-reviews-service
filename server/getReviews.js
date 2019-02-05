const pool = require('../database');
// const db = require('../database');

const retrieveData = (req, res, next) => {
  pool.retrieve(req.params.productId, req.query.reviewType, (err, results) => {
    // db.retrieve(req.params.productId, req.query.reviewType, (err, results) => {
    // console.log(req.query.reviewType)
    if (err) {
      console.log('WOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWW')
      res.status(500).send(err);
    }
    res.reviewData = results;
    next();
  });
};

const getReviewData = (req, res, next) => {
  let mediaURLs = {};
  let filtered = res.reviewData.filter(row => {
    if (!mediaURLs.hasOwnProperty(row.id)) {
      //Put URL into property array 
      //So any future URLs for the same review can be stored there too
      row.media = (row.media !== null) ? [row.media] : [];
      mediaURLs[row.id] = row.media; //Set reference to the first's media property array
      return true; //Keep the current review row
    }
    if (row.media !== null) {
      mediaURLs[row.id].push(row.media); //Add duplicate's media URL to array
    }
    return false; //Discard review duplicate
  });
  res.reviewData = filtered;
  res.keywords = getKeywords(res.reviewData);
  next();
};

const getStarData = (req, res, next) => {
  let starData = {
    counts: Array.from({length: 6}, i => 0),
    total: res.reviewData.length
  };
  
  let sum = 0;
  res.reviewData.forEach(row => {
    starData.counts[row.stars]++;
    sum += row.stars;
  });
  starData.average = (sum / starData.total).toFixed(1);
  res.starData = starData;
  next();
};

const getFeatureData = (req, res, next) => {
  let featureData = {};
  res.reviewData.forEach(row => {
    if (row.feature !== null && !featureData.hasOwnProperty(row.feature)) {
      featureData[row.feature] = row.featureRating;
    }
  });
  res.featureData = featureData;
  
  next();
};

//Get the words most commonly mentioned in the reviews
const stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];

let getTexts = (reviewData) => {
  return reviewData.map(rvw => rvw.body);
};

const getKeywords = (reviewData) => {
  // console.log("########",reviewData)
  let texts = getTexts(reviewData);
  // console.log('####', texts)
  let wordCounts = {};
  texts.forEach(text => {
    // console.log(text)
    let textArray = text.split(/\b\s+/);
    for (let i = 0; i < textArray.length; i++) {
      let word = textArray[i].toLowerCase();
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  let keywords = [];
  for (let word in wordCounts) {
    if (wordCounts[word] > 3 && stopwords.indexOf(word) < 0) {
      keywords.push(word);
    }
  }
  return keywords;
};


module.exports = {retrieveData, getReviewData, getStarData, getFeatureData};