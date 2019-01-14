#!/bin/bash

shopt -s expand_aliases
source ~/.bashrc

START_TIME=$SECONDS
echo "beginning seed..."
sudo -u postgres psql -U postgres -d postgres << EOF
\COPY products (name) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tab1-products.tsv
\COPY authors (username, avatar) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tab2-authors.tsv
\COPY reviews (headline, body, stars, posted, helpful, verified) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tab3-reviews.tsv
\COPY features (feature, rating, count) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tab4-features.tsv
\COPY media (type, url) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tab5-media.tsv
EOF
echo "seeding complete"
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Duration: $(($ELAPSED_TIME/60)) min, $(($ELAPSED_TIME%60)) sec"