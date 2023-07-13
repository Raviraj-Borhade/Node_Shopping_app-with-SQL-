const Sequelize =require('sequelize')


const sequelize = require('../util/database')


const Product =  sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    AllowNull:false,
    primaryKey:true
  },
  title:Sequelize.STRING,
  imgUrl:{
    type:Sequelize.STRING,
    AllowNull:false
  },
  price:{
    type:Sequelize.DOUBLE,
    AllowNull:false,
  },
  description:{
    type:Sequelize.STRING,
    AllowNull:false
  }

})

module.exports = Product
