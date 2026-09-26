const UserModel = require("../../models/userModel");
const moment = require("moment");

const getNewUsersToday = async (req, res) => {
	try {
		const startOfDay = moment().startOf("day").toDate();
		const endOfDay = moment().endOf("day").toDate();

		const usersToday = await UserModel.find({
			createdAt: { $gte: startOfDay, $lte: endOfDay },
		});

		res.status(200).json({
			success: true,
			newUsersToday: usersToday.length,
			data: usersToday,
		});
	} catch (err) {
		res.status(400).json({
			message: err.message || err,
			error: true,
			success: false,
		});
	}
}
const getActiveUsers = async (req,res)=>{
    try {
        const activeSince = moment().subtract(7, "days").toDate(); 
    
        const activeUsers = await UserModel.find({
          lastLogin: { $gte: activeSince },
        })
    
        res.status(200).json({
          success: true,
          activeUsersCount: activeUsers.length,
          data: activeUsers,
        })
      } catch (err) {
        res.status(400).json({
          message: err.message || err,
          error: true,
          success: false,
        })
      }
    
}
const getChurnRate = async (req, res) => {
    try {
      const startOfPeriod = moment().subtract(30, "days").toDate();
      const endOfPeriod = new Date();
      
      const totalUsersBeforePeriod = await UserModel.countDocuments({
        createdAt: { $lt: startOfPeriod },
      });
      
      const churnedUsers = await UserModel.countDocuments({
        lastLogin: { $lt: startOfPeriod },
        createdAt: { $lt: startOfPeriod },
      });
      
  
      const churnRate = totalUsersBeforePeriod === 0
        ? 0
        : (churnedUsers / totalUsersBeforePeriod) * 100;
  
      res.status(200).json({
        success: true,
        churnRate, 
        churnedUsers,
        totalUsersBeforePeriod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || error,
        error: true
      });
    }
  };
  const getNewUsersInMonth = async (req, res) => {
    try {
      const startOfDay = moment().startOf("Month").toDate();
      const endOfDay = moment().endOf("Month").toDate();
  
      const usersToday = await UserModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
  
      res.status(200).json({
        success: true,
        newUsersToday: usersToday.length,
        data: usersToday,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  }

module.exports ={ getNewUsersToday, 
    getActiveUsers,
    getChurnRate,
    getNewUsersInMonth

}
