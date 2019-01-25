const prefaceURL = (path) => {
  // return `https://s3-us-west-1.amazonaws.com/crackling-iceberg-lettuce-120/images/${path}`;
  return ``;
};

const monthByNumber = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const formatDate = date => {
  date = new Date(date);
  let year = date.getFullYear();
  let month = monthByNumber[date.getMonth()];
  let day = date.getDate();
  return `${month} ${day}, ${year}`;
};

//Determine image position to display appropriate number of stars
//Half-star range: 0.3 - 0.8
//All calculations are based on the spritesheet being half-sized
//LARGE STARS: 19 x 19, 1px apart
//  Rows start at 5px and 205px
//SMALL STARS: 16 x 16, 1px apart
// Rows start at 5px and 175px
const setStars = (rating, starSize = 'small') => { 
  let sizes = (starSize === 'large') ? [19, 205] : [16, 175];
  let modulo = rating % 1;
  let left = (5 - Math.ceil(rating)) * sizes[0];
  left += (modulo > 0.2) ? sizes[1] : 5;
  return left;
};

//Convert media urls in the reviews to double-linked list nodes
class MediaNode {
  constructor(url, reviewIndex, index, prev = null, next = null) {
    this.url = url;
    this.prev = prev;
    this.next = next;
    this.reviewIndex = reviewIndex;
    this.index = index;
  }
}

class MediaList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToTail(node) {
    if (this.head === null) { //Empty list
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }
}

const buildMediaList = reviewData => {
  let list = new MediaList();
  reviewData.forEach((review, reviewIndex) => {
    review.media = review.media.map((mediaURL, mediaIndex) => {
      let node = new MediaNode(mediaURL, reviewIndex, mediaIndex);
      list.addToTail(node);
      return node;
    });
  });
  return list;
}

const reorderReviews = (reviewData, sortBy, keyword) => {
  let byTop = (a, b) => {
    return b.helpful - a.helpful;
  };

  let byRecent = (a, b) => {
    return new Date(b.posted) - new Date(a.posted);
  };

  let filter = (reviewData) => {
    return reviewData.filter(review => {
      return review.body.toLowerCase().indexOf(keyword) > -1;
    });
  };

  reviewData = (keyword === undefined) ? reviewData : filter(reviewData);
  return (sortBy === 'top') ? reviewData.sort(byTop) : reviewData.sort(byRecent);
};

export {prefaceURL, formatDate, setStars, buildMediaList, reorderReviews};