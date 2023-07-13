const Product = require("../model/product");
const User = require("../model/user");

exports.getaddproduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "addprod.html"));
  res.render("admin/editproduct", {
    pagetitle: "ADD PRODUCT ",
    path: "/admin/addprod",
    editing: false,
  });
};

exports.postaddproduct = (req, res, next) => {
  //   products.push({ title: req.body.title });

  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const description = req.body.description;
  const price = req.body.price;

  req.user
    .createProduct({
      // this is the alternative option of attaching user to our product database,
      //- we used property on req.user object which is the sequalise object,
      //  It have some additional fuctionality
      title: title,
      imgUrl: imgUrl,
      description: description,
      price: price,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((e) => {
      console.log(e);
    });
  //***************************** ALTERNATE WAY ************************************************ */
  // Product.create({
  //   title:title,
  //   imgUrl:imgUrl,
  //   description:description,
  //   price:price,
  //   userId:req.user.id

  // }).then((result)=>{
  //   console.log(result)
  //   res.redirect('/admin/products')
  // }).catch((e)=>{
  //   console.log(e)
  // })
};

exports.geteditproduct = (req, res, next) => {
  const editmode = req.query.edit;

  if (!editmode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } }) // req.user.getProducts = method called on sequelize object and this method return array of objects
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/editproduct", {
        pagetitle: "edit product ",
        path: "/admin/editprod",
        editing: editmode,
        product: product,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getproducts = (req, res, next) => {
  req.user
    .getProducts() // we are finding products for perticular user
    //Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pagetitle: "All products",
        path: "/admin/products",
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.posteditproduct = (req, res, next) => {
  const prodId = req.body.productId;

  const updatedtitle = req.body.title;
  const updatedimgUrl = req.body.imgUrl;
  const updateddescription = req.body.description;
  const updatedprice = req.body.price;

  Product.findByPk(prodId)
    .then((product) => {
      (product.title = updatedtitle),
        (product.imgUrl = updatedimgUrl),
        (product.description = updateddescription),
        (product.price = updatedprice);
      return product.save();
    })
    .then((result) => {
      console.log("updated product saved");
      res.redirect("/admin/products");
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postdeleteproduct = (req, res, next) => {
  console.log(JSON.stringify(req.body));
  const prodId = req.body.productId;

  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log("product deleted");
      res.redirect("/admin/products");
    })
    .catch((e) => {
      console.log(e);
    });
};
