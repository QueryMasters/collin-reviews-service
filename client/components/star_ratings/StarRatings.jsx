import React from 'react';
import FeatureRating from './FeatureRating.jsx';
import starStyles from './stylesStars.css';
import styles from '../styled_components/stylesComponents.css';
import {FiveStars} from '../styled_components/StyledComponents.jsx';

const StarBar = ({stars, percent}) => {
  let innerBarWidth = {width: `${percent}%`};
  return (
    <div key={stars} className={starStyles.starBarWrapper}>
      <div className={starStyles.starNumber}>{stars} star</div>
      <div className={starStyles.starBarOuter}>
        <div className={starStyles.starBarInner} style={innerBarWidth}> </div>
      </div>
      <div className={starStyles.starPercent}>{percent.toFixed(0)}%</div>
    </div>
  );
};

const Popup = () => {
  return (
    <div className={starStyles.popup}>
      <div className={starStyles.tail}></div>
      <div className={starStyles.bubble}>
        <a className={starStyles.popupX}>
          <div className={styles.x}></div>
        </a>
        <div>
          Amazon calculates a product’s star ratings based on a <br/>machine learned model instead of a raw data average. The model takes into account factors including the age of a rating, whether the ratings are from verified purchasers, and factors that establish reviewer trustworthiness.
        </div>
      </div>
    </div>
  );
};

const StarRatings = ({starData, featureData}) => {
  return (
    <div className={`${starStyles.starRatings}`}>
      <div className={starStyles.section}>
        <div className={starStyles.sectionHeader}>{starData.total} customer  
          {(starData.total !== 1) ? ' reviews' : ' review'}
        </div>
        
        <div className={starStyles.overall}>
          <FiveStars rating={starData.average}/>
          <span>{starData.average} out of 5 stars</span>
          <div className={starStyles.v}></div>
          <Popup />
        </div>

        <div className={starStyles.starBarTable}>
          {
            starData.counts.map((count, stars) => {
              let percent = (count / starData.total) * 100;
              return (stars === 0) 
                ? ''
                : <StarBar key={stars} stars={stars} percent={percent} />;
            })
          }
        </div>
      </div>
      
      <div>
        {
          (Object.keys(featureData).length < 1)
            ? ''
            : <div className={starStyles.section}>
              <div className={starStyles.sectionHeader}>By feature</div>
              <div>
                {
                  Object.entries(featureData).map(pair => {
                    return <FeatureRating feature={pair[0]} rating={pair[1]}/>
                  })
                }
              </div>
            </div>
        }
      </div>

      <div className={starStyles.section}>
        <div className={starStyles.sectionHeader}>Review this product</div>
        <p>Share your thoughts with other customers</p>
        <button className={styles.styledButton}>Write a customer review</button>
      </div>
    </div>
  );

};

export default StarRatings;