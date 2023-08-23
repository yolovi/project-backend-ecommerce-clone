//IMPORT
const { Order, Product } = require("../models/index.js");

// const errors = [];

// for (const product of products) {
//   const availableProduct = await Product.findByPk(product.id); // Usar findByPk en lugar de findById
//   if (!availableProduct || product.quantity > availableProduct.stock) {
//     errors.push(`Product ${product.id} is not available or quantity is too high.`);
//   }
// }

const OrderController = {
    async insert(req, res, next) {
      try {
        req.body.UserId = req.user.id;
        const productIds = req.body.ProductId;
        const products = await Product.findAll({
          where: {
            id: productIds,
          },
        });
  
        const existingProductIds = products.map((product) => product.id);
        const missingProductIds = productIds.filter(
          (productId) => !existingProductIds.includes(productId)
        );
  
        const errors = [];
  
        for (const product of products) {
          const availableProduct = await Product.findByPk(product.id);
          if (!availableProduct || product.quantity > availableProduct.stock) {
            errors.push(`Product ${product.id} is not available or quantity is too high.`);
          }
        }
  
        if (errors.length > 0) {
          throw new Error(errors.join(" "));
        }
  
        if (missingProductIds.length > 0) {
          return res.status(404).send({
            error: `Product(s) ${missingProductIds.join(", ")} not found.`,
          });
        }
  
        const order = await Order.create(req.body);
        await order.addProducts(products);
  
        res.status(201).send({
          message: "Order created successfully",
          order_created: order,
          products_added: productIds,
        });
      } catch (error) {
        next(error); // Pasar el error al middleware de errores
      }
    },

  async getAll(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            attributes: ["id", "name_product", "price"],
            through: { attributes: [] },
          },
        ],
      });
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send({ message: "Failed to retrieve orders", error });
    }
  },
};

//EXPORT
module.exports = OrderController;
