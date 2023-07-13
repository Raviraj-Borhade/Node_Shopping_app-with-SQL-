const Product = require("../model/product");
const Cart = require("../model/cart");

exports.getproduct = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/productlist", {
        prods: product,
        pagetitle: "All products",
        path: "/products",
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getdetails = (req, res, next) => {
  const prodId = req.params.productId;

  //****************************** ALTERNATIVE APPROACH******************************************* */

  // Product.findAll({where:{id:prodId}}).then((products)=>{
  //   res.render("shop/productdetail", {
  //     product: products[0], // because fetchAll() always return the array of products
  //     pagetitle: products[0
  //     ].title,
  //     path: "/products",
  //   });
  // }).catch((e)=>{
  //   console.log(e)
  // })

  //************************************************************************************************* */

  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/productdetail", {
        pagetitle: product.title,

        product: product,
        path: "/products",
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pagetitle: "shop",
        path: "/",
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getcart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      // used sequelize object user
      return cart.getProducts();
    })
    .then((products) => {
      res
        .render("shop/cart", {
          path: "/cart",
          pagetitle: "Your cart",
          products: products,
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postcart = (req, res, next) => {
  const prodId = req.body.productId;

  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } }); // returns array
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        console.log(oldQuantity);
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getorders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pagetitle: "Your orders",
        orders: orders,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.checkout = (req, res, next) => {
  res.render("/shop/chekout", {
    path: "/checkout",
    pagetitle: "checkout",
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      console.log("product deleted from cart Items!!");
      res.redirect("/cart");
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postorder = (req, res, next) => {
  let fetchedCart; // for clearing cart after order confirmation
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        order
          .addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
          .catch((e) => {
            console.log(e);
          });
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null); // deleting the cartItems after confirming order
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((e) => {
      console.log(e);
    });
};
