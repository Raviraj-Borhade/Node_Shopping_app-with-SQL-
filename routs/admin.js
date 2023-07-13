const path = require("path");
const express = require("express");
const router = express.Router();

const adminconroller = require("../controller/admin");

//admin/addprod= get
router.get("/addprod", adminconroller.getaddproduct);

router.get("/products", adminconroller.getproducts);

//admin/product ==post
router.post("/addprod", adminconroller.postaddproduct);

router.get("/editproduct/:productId", adminconroller.geteditproduct);

router.post("/editproduct", adminconroller.posteditproduct);

router.post("/deleteproduct", adminconroller.postdeleteproduct);

module.exports = router;
