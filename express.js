const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");

const expresshbs = require("express-handlebars");
const hbs = require("hbs");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const Adminrout = require("./routs/admin");
const Shoprout = require("./routs/shop");
app.use((req, res, next) => {
  // used middleware for our dummy user
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => {
      console.log(e);
    });
});

const errorcontroller = require("./controller/error");
const sequelize = require("./util/database");
const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/cart");
const CartItem = require("./model/cart-item");
const Order = require("./model/order");
const OrderItem = require("./model/order_items");

app.use("/admin", Adminrout);
app.use(Shoprout);
app.use(errorcontroller.get404);

//Assosiations : Adding relations among the databases

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); // reverse of above statement // dont need to add this if you have 'User.belongsTo(Cart)' statement
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// used sync({force:true}) because,Products table was already created and to apply the new relations on existing data i have used force:true
// sequelize
//   .sync({ force: true })
sequelize
  .sync()
  .then((result) => {
    // sync our model to the database and create a table for our models
    //  console.log(result)
    console.log("connected properly");
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "namu", email: "test@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((e) => {
    console.log(e);
  });

// app.listen(3000, () => {
//   console.log("server up and runing");
// });
