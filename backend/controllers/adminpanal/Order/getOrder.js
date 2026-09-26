const OrderModel = require('../../../models/orderProductModel');

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 });

        const result = orders.map((order, index) => ({
            orderId: `ORD${String(index + 1).padStart(3, '0')}`,
            name: order.name,
            total: order.totalAmount,
            status: order.status || 'Pending',
            date: order.createdAt.toISOString().split('T')[0],
            _id: order._id,
        }));

        res.status(200).json({
            data: result,
            success: true,
            error: false,

        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error when fetching orders' });
    }
};


module.exports = {
    getAllOrders
};
