#!/bin/bash

shopt -s expand_aliases
source ~/.bashrc

echo "recreating keyspace..."
# /usr/local/cassandra/bin/cqlsh < schema.cql
echo "ready to seed"

START_TIME=$SECONDS
echo "beginning seed..."
# /usr/local/cassandra/bin/cqlsh localhost << EOF
USE amazon_reviews;
copy "products" (partition_id, clustering_id, name) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tsv/cass-tab1-products.tsv' WITH DELIMITER ='\t' AND HEADER = FALSE;
copy "authors" (partition_id, clustering_id, username, avatar) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tsv/cass-tab2-authors.tsv' WITH DELIMITER ='\t' AND HEADER = FALSE;
copy "reviews" (partition_id, clustering_id, headline, body, stars, posted, helpful, verified) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tsv/cass-tab3-reviews.tsv' WITH DELIMITER ='\t' AND HEADER = FALSE;
copy "features" (partition_id, clustering_id, feature, rating, count) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tsv/cass-tab4-features.tsv' WITH DELIMITER ='\t' AND HEADER = FALSE;
copy "media" (partition_id, clustering_id, type, url) FROM '/home/collin/Documents/hr-sdc/collin-reviews-service/database/tsv/cass-tab5-media.tsv' WITH DELIMITER ='\t' AND HEADER = FALSE;
EOF
echo "seeding complete"
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Duration: $(($ELAPSED_TIME/60)) min, $(($ELAPSED_TIME%60)) sec"