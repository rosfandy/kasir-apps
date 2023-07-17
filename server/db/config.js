const { Sequelize } = require('sequelize');
let sequelize = new Sequelize('sqlite::memory:');

sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'C:\\myfiles\\Native\\Electron\\kasirserver\\db\\database.db'
});

sequelize.authenticate().then(() => {
    console.log("database connected")
}).catch((err) => {
    console.log('error: ', err)
})

module.exports = sequelize