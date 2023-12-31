//IMPORT
const express = require("express");
const ProductController = require("../controllers/ProductController");
const router = express.Router();
const { authentication, isAdmin } = require("../middleware/authentication");
const { uploadUserProductsImages } = require("../middleware/multer");
const { typeError } = require("../middleware/errors");

//ROUTES
router.post(
  "/",
  authentication,
  isAdmin,
  uploadUserProductsImages.single("imageProduct"),
  ProductController.addProduct
);
router.put("/id/:id", authentication, ProductController.update);
router.get("/id/:id", ProductController.getById);
router.get("/name_product/:name_product", ProductController.getOneByName);
router.get("/getAll", ProductController.getAll);
router.get("/price/:price", ProductController.getByPrice);
router.get("/price_range", ProductController.getByPriceRange);
router.get("/price_desc", ProductController.orderDescByPrice);
router.get("/price_asc", ProductController.orderAscByPrice);
router.get('/images/:imageName', ProductController.serveProductImage);
router.delete("/id/:id", authentication, isAdmin, ProductController.delete);

router.use(typeError);

//EXPORTS
module.exports = router;
