#!/bin/bash

START_TIME=$SECONDS
echo "beginning seed..."
sudo -u postgres psql -U postgres -d postgres << EOF
\c postgres
CREATE INDEX products_desc_index ON products (id, name desc);
CREATE INDEX products_asc_index ON products (id, name asc);
CREATE INDEX authors_id_index ON authors (id, username desc);
CREATE INDEX authors_asc_index ON authors (id, username asc);
CREATE INDEX reviews_desc_index ON reviews (stars desc, helpful desc);
CREATE INDEX reviews_asc_index ON reviews (stars asc, helpful desc);
CREATE INDEX reviews_newest_posted_index ON reviews (posted desc);
CREATE INDEX reviews_oldest_posted_index ON reviews (posted asc);
CREATE INDEX media_id_index ON media (id);
EOF
echo "seeding complete"
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Duration: $(($ELAPSED_TIME/60)) min, $(($ELAPSED_TIME%60)) sec"