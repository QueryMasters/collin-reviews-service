# Derived from official mysql image (our base image)
FROM mysql:5.7.24

ENV MYSQL_DATABASE amazon_reviews
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes
# Add the content of the sql-scripts/ directory to your image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup
COPY . /docker-entrypoint-initdb.d/

