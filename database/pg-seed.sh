#!/bin/bash

shopt -s expand_aliases
source ~/.bashrc

START_TIME=$SECONDS
echo "beginning seed..."
sudo -u postgres psql -U postgres -d postgres << EOF
\COPY products (name) FROM '/home/collin/code/hr/collin-reviews-service/database/tsv/tab1-products.tsv'
\COPY authors (username, avatar) FROM '/home/collin/code/hr/collin-reviews-service/database/tsv/tab2-authors.tsv'
\COPY reviews (headline, body, stars, posted, helpful, verified, author_id, product_id) FROM '/home/collin/code/hr/collin-reviews-service/database/tsv/tab3-reviews.tsv'
\COPY features (feature, rating, count, product_id) FROM '/home/collin/code/hr/collin-reviews-service/database/tsv/tab4-features.tsv'
\COPY media (type, url, review_id) FROM '/home/collin/code/hr/collin-reviews-service/database/tsv/tab5-media.tsv'
EOF
echo "seeding complete"
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Duration: $(($ELAPSED_TIME/60)) min, $(($ELAPSED_TIME%60)) sec"