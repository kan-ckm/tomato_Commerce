const User = require('../../models/userModel')
const Review = require("../../models/reviewModel");
const Order = require('../../models/orderProductModel');
const Product = require('../../models/productModel');
const moment = require('moment');

const getUserGrowth = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastYear = new Date();  
    lastYear.setFullYear(currentDate.getFullYear() - 1);

    const rawData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear }
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const fullData = months.map((name, index) => {
      const found = rawData.find(item => item._id === index + 1);
      return {
        month: name,
        users: found ? found.total : 0
      };
    });

    res.status(200).json({ success: true, data: fullData, error: false });
  } catch (err) {
      res.status(400).json({
              message : err?.message || err,
              error : true,
              success : false
          })
  }
};

const getUserActivityHeatmap = async (req, res) => {
  try {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);

    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek } 
        }
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$createdAt" }, 
          hour: { $hour: "$createdAt" }
        }
      },
      {
        $group: {
          _id: {
            dayOfWeek: "$dayOfWeek",
            hourRange: {
              $switch: {
                branches: [
                  { case: { $lt: ["$hour", 4] }, then: "0-4" },
                  { case: { $lt: ["$hour", 8] }, then: "4-8" },
                  { case: { $lt: ["$hour", 12] }, then: "8-12" },
                  { case: { $lt: ["$hour", 16] }, then: "12-16" },
                  { case: { $lt: ["$hour", 20] }, then: "16-20" },
                ],
                default: "20-24"
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.dayOfWeek",
          hours: {
            $push: {
              k: "$_id.hourRange",
              v: "$count"
            }
          }
        }
      },
      {
        $project: {
          dayOfWeek: "$_id",
          hours: { $arrayToObject: "$hours" },
          _id: 0
        }
      },
      {
        $sort: { dayOfWeek: 1 }
      }
    ]);

    const dayMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    };

    const formatted = [];
    for (let i = 1; i <= 7; i++) {
      const dayData = data.find(d => d.dayOfWeek === i) || { hours: {} };
      formatted.push({
        name: dayMap[i],
        "0-4": dayData.hours["0-4"] || 0,
        "4-8": dayData.hours["4-8"] || 0,
        "8-12": dayData.hours["8-12"] || 0,
        "12-16": dayData.hours["12-16"] || 0,
        "16-20": dayData.hours["16-20"] || 0,
        "20-24": dayData.hours["20-24"] || 0,
      });
    }

    res.status(200).json({ success: true, data: { formatted } });
  } catch (er) {

      res.status(400).json({
            message : err?.message || err,
            error : true,
            success : false
        })
  }
};

const getReviewSummary = async (req, res) => {
  try {
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const result = [1, 2, 3, 4, 5].map(star => {
      const found = reviewStats.find(r => r._id === star);
      return {
        name: `${star}★`,
        value: found ? found.count : 0
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
     res.status(400).json({
            message : err?.message || err,
            error : true,
            success : false
        })
  }
};

const getSalesTrend = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthSalesMap = {};
    salesData.forEach(item => {
      monthSalesMap[item._id] = item.totalSales;
    });

    const fullData = monthNames.map((name, index) => ({
      month: name,
      sales: monthSalesMap[index + 1] || 0
    }));

    res.json({ success: true, data: fullData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getTotalSalesThisMonth = async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const orders = await Order.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      "paymentDetails.payment_status": "paid"
    });
   

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      totalSales,
      orderCount: orders.length,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || err,
      error: true,
    });
  }
};

const getSalesOverview = async (req, res) => {
  try {
    const orders = await Order.find({
      "paymentDetails.payment_status": "paid",
    });

    const salesData = [
      { name: "Jan", sales: 0 },
      { name: "Feb", sales: 0 },
      { name: "Mar", sales: 0 },
      { name: "Apr", sales: 0 },
      { name: "May", sales: 0 },
      { name: "Jun", sales: 0 },
      { name: "Jul", sales: 0 },
      { name: "Aug", sales: 0 },
      { name: "Sep", sales: 0 },
      { name: "Oct", sales: 0 },
      { name: "Nov", sales: 0 },
      { name: "Dec", sales: 0 },
    ];

    orders.forEach((order) => {
      const month = moment(order.createdAt).month();
      const salesMonth = salesData[month];
      if (salesMonth) {
        salesMonth.sales += order.totalAmount;
      }
    });

    res.status(200).json({
      success: true,
      salesData,
    });
  } catch (err) {
    console.error("Error fetching sales overview:", err);
    res.status(400).json({
      success: false,
      message: err.message || err,
    });
  }
};

const getCategoryDistribution = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: "$sales" }
        }
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0
        }
      },
      { $sort: { value: -1 } }
    ]);

    res.json({ data: result });
  } catch(err){
    res.status(400).json({
      message : err?.message || err,
      error : true,
      success : false
    })
  }
};

module.exports = {
  getUserGrowth,
  getUserActivityHeatmap,
  getReviewSummary,
  getSalesTrend,
  getTotalSalesThisMonth,
  getSalesOverview,
  getCategoryDistribution
};
