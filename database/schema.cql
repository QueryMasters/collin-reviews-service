DROP KEYSPACE IF EXISTS amazon_reviews;

CREATE KEYSPACE IF NOT EXISTS amazon_reviews
   WITH REPLICATION = { 
      'class' : 'SimpleStrategy', 'replication_factor' : 3 };

USE amazon_reviews;

DROP TABLE IF EXISTS "products";

CREATE TABLE IF NOT EXISTS "products"( 
   partition_id int,
   clustering_id int,
   name text,
   PRIMARY KEY (partition_id, clustering_id)
);

DROP TABLE IF EXISTS "authors";

CREATE TABLE IF NOT EXISTS "authors"(
  partition_id int,
  clustering_id int,
  username text,
  avatar text,
  PRIMARY KEY (partition_id, clustering_id)
);

DROP TABLE IF EXISTS "reviews";

CREATE TABLE IF NOT EXISTS "reviews"(
  partition_id int,
  clustering_id int,
  headline text,
  body text,
  stars int,
  posted date,
  helpful int,
  verified boolean,
  PRIMARY KEY (partition_id, clustering_id)
);

DROP TABLE IF EXISTS "features";

CREATE TABLE IF NOT EXISTS "features"(
  partition_id int,
  clustering_id int,
  feature text,
  rating int,
  count int,
  PRIMARY KEY (partition_id, clustering_id)
);

DROP TABLE IF EXISTS "media";

CREATE TABLE IF NOT EXISTS "media"(
  partition_id int,
  clustering_id int,
  type text,
  url text,
  PRIMARY KEY (partition_id, clustering_id)
);