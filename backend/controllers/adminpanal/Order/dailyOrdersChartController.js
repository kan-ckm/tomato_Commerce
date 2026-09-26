const Order = require('../../../models/orderProductModel');

const getOrdersChart = async (req, res) => {
  try {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 6);

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%m/%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const labels = [];
    const dataMap = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      labels.push(label);
      dataMap[label] = 0;
    }

    orders.forEach(order => {
      dataMap[order._id] = order.count;
    });

    const data = labels.map(label => dataMap[label]);

    const chartData = labels.map((label, index) => ({
      date: label,
      orders: data[index]
    }));

    res.status(200).json({
      success: true,
      error: false,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = {
  getOrdersChart
};
