DROP DATABASE IF EXISTS amazon_reviews;
CREATE DATABASE amazon_reviews;

USE amazon_reviews;

CREATE TABLE products (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(200)
);

CREATE TABLE authors (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100),
	avatar VARCHAR(200)
);

CREATE TABLE reviews (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	headline VARCHAR(80),
	body VARCHAR(1000),
	stars INTEGER,
	posted DATE NOT NULL,
	helpful INTEGER,
	verified BOOLEAN DEFAULT false,
	author_id INTEGER,
	product_id INTEGER,
	FOREIGN KEY (author_id) REFERENCES authors(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE features (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	feature VARCHAR(80),
	rating INTEGER,
	count INTEGER,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE media (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	type VARCHAR(5),
	URL VARCHAR(200),
	review_id INTEGER,
	FOREIGN KEY (review_id) REFERENCES reviews(id)
);
