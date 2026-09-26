const OrderModel = require('../../../models/orderProductModel');

const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;
		await OrderModel.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Delete success" });
	} catch (err) {
		console.error("Lỗi xoá đơn hàng:", err);
		res.status(500).json({ success: false, message: "error" });
	}
};

module.exports = { deleteOrder };
