//IMPORT
const { Product, Category, Sequelize } = require("../models/index.js");
const { Op } = Sequelize;
const path = require('path');

//CONTROLADORES
const ProductController = {

  async addProduct(req, res, next) {
    try {
      const productData = {
        ...req.body,
        UserId: req.user.id,
        // Verifica si se ha subido una imagen y asigna el nombre del archivo al campo image_path en productData
        image_path: req.file ? req.file.filename : null,
      };

      const product = await Product.create(productData);
      //await Category.findByIdAndUpdate(req.body.CategoryId, { $push: { productIds: product._id } });
      res
        .status(201)
        .send({ message: "Product created successfully", product });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async update(req, res) {
    try {
      const rowUpdated = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (rowUpdated === 0) {
        return res.status(404).send({ error: "Product not found." });
      }
      const productUpdated = await Product.findByPk(req.params.id);
      if (!productUpdated) {
        return res.status(404).send({ error: "Product not found." });
      }
      res
        .status(201)
        .send({ msg: "Product updated successfully", productUpdated });
    } catch (error) {
      res.status(500).send({ message: "Error updating product", error });
    }
  },
  async delete(req, res) {
    try {
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Product deleted successfully");
    } catch (error) {
      res.status(500).send({ message: "Error deleting product", error });
    }
  },
  async getAll(req, res) {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, attributes: ["name_category"] }],
      });
      const productsWithImageUrls = products.map(product => ({
        ...product.toJSON(),
        image_url: `/public/images/user/products/${product.image_path}`, // Cambia la ruta según tu estructura de carpetas
      }));
      res.status(200).send(productsWithImageUrls);
    } catch (error) {
      res.status(500).send({ message: "Error loading products", error });
    }
  },
  async getById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async getOneByName(req, res) {
    try {
      const product = await Product.findOne({
        where: {
          name_product: {
            [Op.like]: `%${req.params.name_product}%`,
          },
        },
      });
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async getByPrice(req, res) {
    try {
      const filteredProducts = await Product.findAll({
        where: {
          price: req.params.price,
        },
      });
      if (filteredProducts.length === 0) {
        return res.status(404).send({ error: "No products found." });
      }
      res.status(200).send(filteredProducts);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async getByPriceRange(req, res) {
    try {
      const minPrice = req.query.min || 0;
      const maxPrice = req.query.max || Infinity;
      const filteredProducts = await Product.findAll({
        where: {
          price: {
            [Op.and]: [{ [Op.gte]: minPrice }, { [Op.lte]: maxPrice }],
          },
        },
      });
      res.status(200).send(filteredProducts);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async orderDescByPrice(req, res) {
    try {
      const filteredProducts = await Product.findAll({
        order: [["price", "DESC"]],
      });
      res.status(200).send(filteredProducts);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async orderAscByPrice(req, res) {
    try {
      const filteredProducts = await Product.findAll({
        order: [["price", "ASC"]],
      });
      res.status(200).send(filteredProducts);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  

  async serveProductImage(req, res) {
    try {
      const imageName = req.params.imageName;
      const imagePath = path.join(__dirname, '../public/images/user/products', imageName);
    
      console.log(`Serving image: ${imagePath}`);
    
      res.sendFile(imagePath);
    } catch (error) {
      res.status(500).send({ message: "Error serving product image", error });
    }
  },
};

module.exports = ProductController;
