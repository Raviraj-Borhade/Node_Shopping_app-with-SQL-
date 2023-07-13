const Sequelize = require('sequelize')

const sequelize = new Sequelize ('node-complete','root','Raviraj@123',{dialect:'mysql',host:'localhost'})



module.exports = sequelize;
















// const mysql = require('mysql2')

// const pool = mysql.createPool({            /// for using the querys we have to use the pool
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'Raviraj@123'
// })


// module.exports = pool.promise()