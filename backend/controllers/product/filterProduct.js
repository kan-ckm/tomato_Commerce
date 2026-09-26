const Product = require("../../models/productModel");

const getFilteredProducts = async (req, res) => {
  try {
    let { category, sortBy } = req.query;

    const filter = {};

    if (category) {
      const categoriesArray = category.split(",");
      filter.category = { $in: categoriesArray };
    }

    let query = Product.find(filter);

    if (sortBy === "price-asc") {
      query = query.sort({ sellingPrice: 1 });
    }
    if (sortBy === "price-desc") {
      query = query.sort({ sellingPrice: -1 });
    }

    const products = await query;

    res.status(200).json({
      success: true,
      message: "Filtered products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = getFilteredProducts;
