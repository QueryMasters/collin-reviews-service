const Sequelize = require('sequelize');
const { database, user, password, port, host} = require('./config');

const connection = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false
});

connection.authenticate()
  .then(() => {
    console.log('Connected to the PostgreSQL');
  })
  .catch(err => {
    console.log(err);
  });

connection.sync({ force: true })
  .then(() => {
    console.log('Success');
  });

module.exports = {
  
};
