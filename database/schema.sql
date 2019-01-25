DROP TABLE IF EXISTS products;
CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name character(200)
);

DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
	id SERIAL PRIMARY KEY,
	username character(100),
	avatar character(200)
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
	headline character(80),
	body text,
	stars INTEGER NOT NULL,
	posted DATE NOT NULL,
	helpful INTEGER NOT NULL,
	verified BOOLEAN DEFAULT false,
	author_id INTEGER REFERENCES authors(id),
	product_id INTEGER REFERENCES products(id)
); 

DROP TABLE IF EXISTS features;
CREATE TABLE features (
	id SERIAL PRIMARY KEY,
	feature character(80),
	rating NUMERIC(1, 0),
	count INTEGER NOT NULL,
	product_id INTEGER REFERENCES products(id)
);

DROP TABLE IF EXISTS media;
CREATE TABLE media (
	id SERIAL PRIMARY KEY,
	type CHARACTER(5),
	URL CHARACTER(200),
	review_id INTEGER REFERENCES reviews(id)
);