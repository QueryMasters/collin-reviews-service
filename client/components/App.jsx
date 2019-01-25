import React from 'react';
import StarRatings from './star_ratings/StarRatings.jsx';
import CustomerImageList from './customer_images/CustomerImageList.jsx';
import ImageModal from './modal/ImageModal.jsx';
import Keywords from './keywords/Keywords.jsx';
import ReviewList from './reviews/ReviewList.jsx';
import {buildMediaList, reorderReviews} from '../helpers';
import styles from './stylesApp.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewData: [],
      displayedReviews: [],
      starData: {},
      featureData: {},
      mediaList: null,
      keywords: [],
      productId: 29,
      filter: '',
      sortBy: 'top',
      modal: {
        display: false,
        mediaIndex: -1,
        reviewIndex: -1
      }
    };
  } 

  componentDidMount() {
    this.fetchReviews(this.state.productId);
  }

  fetchReviews(productId) {
    fetch(`/reviews/${productId}`, {
      // fetch(`/reviews/1`, {
      method: 'GET'
    })
      .then(res => {
        // console.log(res)
        return res.json();
      })
      .then(reviews => {
        console.log(reviews)
        this.processReviews(reviews);
      })
      .catch(err => {
        console.log('ERROR FETCHING REVIEWS****************', err);
      });   
  }

  processReviews({reviewData, starData, featureData, keywords}) {
    let mediaList = buildMediaList(reviewData);
    this.setState({
      reviewData,
      starData,
      featureData,
      mediaList,
      keywords,
      displayedReviews: reviewData
    }, err => {
      if (err) {
        console.log('Error in setState');
        throw err;
      }
    });
  }

  displayImageInModal(e) {
    e.preventDefault();
    let data = e.currentTarget.dataset;
    document.documentElement.style.overflow = 'hidden';
    this.setState({
        modal: {
          display: true,
          mediaIndex: parseInt(data.mediaIndex),
          reviewIndex: parseInt(data.reviewIndex)
        }
    }, err => {
      if (err) throw err;
    });
  }

  toggleModal() {
    return (e) => {
      e.preventDefault();
      this.setState({
        modal: {
          display: !this.state.modal.display,
          mediaIndex: -1,
          reviewIndex: -1
        }
      }, err => {
        if (err) throw err;
        document.documentElement.style.overflow = (this.state.modal.display) ? 'hidden' : 'scroll';
      });
    }
  }

  changeDisplayedReviews(e) {
    e.preventDefault();
    let newDisplay;
    let filter = this.state.filter;
    let sortBy = this.state.sortBy;

    let params = e.target.dataset;
    let reorderType = params.value || e.target.value;

    if (reorderType === 'reset') {
      filter = '';
      newDisplay = reorderReviews(this.state.reviewData, sortBy);
    } else if (reorderType === 'keyword') {
      filter = params.filter;
      newDisplay = reorderReviews(this.state.reviewData, reorderType, params.filter);
    } else {
      sortBy = reorderType;
      newDisplay = reorderReviews(this.state.displayedReviews, reorderType);
    }
    this.setState({
      filter,
      sortBy,
      displayedReviews: newDisplay
    });
  }

  render() {
    let scrollable = (!this.state.modal.display) ? '' : styles.noScroll;
    return (
      <div className={`${styles.styledApp} ${scrollable}`}>
        {
          (!this.state.modal.display) ? '' :
            <ImageModal 
              mediaIndex={this.state.modal.mediaIndex}
              productReview={this.state.reviewData[this.state.modal.reviewIndex]}
              mediaList={this.state.mediaList}
              toggleModal={this.toggleModal()}
              displayImageInModal={this.displayImageInModal.bind(this)}/>
        }
        {
          (!this.state.starData.hasOwnProperty('total')) ? '' : 
            <StarRatings 
              starData={this.state.starData} 
              featureData={this.state.featureData}/>
        }
        
        <div className={styles.reviewWrapper}>
          {
            (!this.state.reviewData.length > 0) ? '' : 
            <>
              <CustomerImageList 
                mediaList={this.state.mediaList}
                toggleModal={this.toggleModal()}
                displayImageInModal={this.displayImageInModal.bind(this)}/>
              <Keywords keywords={this.state.keywords}
                filter={this.state.filter}
                changeDisplayedReviews={this.changeDisplayedReviews.bind(this)}/>
              <ReviewList reviews={this.state.displayedReviews} 
                filter={this.state.filter}
                displayImageInModal={this.displayImageInModal.bind(this)}
                changeDisplayedReviews={this.changeDisplayedReviews.bind(this)}/>
            </>
          }
        </div>
      </div>
    );
  }
}
export default App;