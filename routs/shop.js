const path = require("path");
const express = require("express");
const router = express.Router();
const shopconroller = require("../controller/shop");

router.get("/", shopconroller.getIndex);

router.get("/productlist", shopconroller.getproduct);

router.get("/products/:productId", shopconroller.getdetails);

router.get("/cart", shopconroller.getcart);

router.post("/cart", shopconroller.postcart);

router.get("/orders", shopconroller.getorders);

router.get("/checkout", shopconroller.checkout);

router.post("/cart/delete-item", shopconroller.postCartDeleteProduct);

router.post("/create-order", shopconroller.postorder);

module.exports = router;
