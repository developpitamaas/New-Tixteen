const Attendance = require("../../models/staff/attendance");
const Trycatch = require("../../middleware/trycatch");

const createAttendance = Trycatch(async (req, res, next) => {
  const { staff_id, hour, minute, date } = req.body;
  var user = staff_id || req.user.user;
  const now = new Date();
  
  // Convert to Indian Standard Time (IST)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  
  const Attendancedate = date || istDate.toISOString().split("T")[0];
  const Attendancehour = hour || String(istDate.getUTCHours()).padStart(2, "0");
  const Attendanceminute = minute || String(istDate.getUTCMinutes()).padStart(2, "0");
  const leave = "0";

  const attendance = await Attendance.create({
    date: Attendancedate,
    staff_id: user,
    hour: Attendancehour,
    minute: Attendanceminute,
    leave,
  });

  res.status(201).json({
    status: "success",
    data: {
      attendance,
    },
  });
});

const createAttendanceOLDTimeZone = Trycatch(async (req, res, next) => {
  const { staff_id, hour, minute, date } = req.body;
  var user = staff_id || req.user.user;
  const now = new Date();
  const Attendancedate = date || now.toISOString().split("T")[0];
  const Attendancehour = hour || String(now.getHours()).padStart(2, "0");
  const Attendanceminute = minute || String(now.getMinutes()).padStart(2, "0");
  const leave = "0";

  // Determine the attendance status
  // const attendanceTime = new Date(`${Attendancedate}T${Attendancehour}:${Attendanceminute}:00`);
  // const cutoffTime = new Date(`${Attendancedate}T10:30:00`);
  // const status = attendanceTime <= cutoffTime ? "full day" : "half day";

  const attendance = await Attendance.create({
    date: Attendancedate,
    staff_id: user,
    hour: Attendancehour,
    minute: Attendanceminute,
    leave,
  });

  res.status(201).json({
    status: "success",
    data: {
      attendance,
    },
  });
});




// const createAttendance = Trycatch(async (req, res, next) => {
//   const { staff_id, hour, minute, date } = req.body;
//   var user = staff_id || req.user.user;
//   const now = new Date();
//   const Attendancedate = date || now.toISOString().split("T")[0];
//   const Attendancehour = hour || String(now.getHours()).padStart(2, "0");
//   const Attendanceminute = minute || String(now.getMinutes()).padStart(2, "0");
//   const leave = "0";

//   const attendance = await Attendance.create({
//       date: Attendancedate,
//       staff_id: user,
//       hour: Attendancehour,
//       minute: Attendanceminute,
//       leave,
//   });
//   res.status(201).json({
//       status: "success",
//       data: {
//           attendance,
//       },
//   });
// });

// const createLeave = Trycatch(async (req, res, next) => {
//   const { staff_id, date } = req.body;
//   var user = staff_id || req.user.user;
//   const now = new Date();
//   const LeaveDate = date || now.toISOString().split("T")[0];
//   const leaveHour = '0';
//   const leaveMinute = '0';

//   const leave = await Leave.create({
//       date: LeaveDate,
//       staff_id: user,
//       hour: leaveHour,
//       minute: leaveMinute,
//   });
//   res.status(201).json({
//       status: "success",
//       data: {
//           leave,
//       },
//   });
// });

const createLeave = Trycatch(async (req, res, next) => {
  const { staff_id, date } = req.body;
  var user = staff_id || req.user.user;
  const now = new Date();
  const LeaveDate = date || now.toISOString().split("T")[0];
  const leaveHour = '0';
  const leaveMinute = '0';

  const leave = await Leave.create({
    date: LeaveDate,
    staff_id: user,
    hour: leaveHour,
    minute: leaveMinute,
  });

  res.status(201).json({
    status: "success",
    data: {
      leave,
    },
  });
});

// get all attendance
const getAllAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.find();
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});

// get single attendance
const getSingleAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.find({ staff_id: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});

// update attendance
const updateAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});

// delete attendance
const deleteAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});
// get my attendance
const getMyAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.find({ staff_id: req.user.id });
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});

// get monthly attendance
const getMonthlyAttendance = Trycatch(async (req, res, next) => {
  const attendance = await Attendance.aggregate([
    {
      $match: {
        staff_id: req.user.id,
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        total: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
      },
    },
  ]);
  
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});


const createOrUpdateAttendance = Trycatch(async (req, res, next) => {
  const { staff_id, date, hour = '0', minute = '0', leave = 'on leave' } = req.body;
  const user = staff_id || req.user.user;
  const attendanceDate = date || new Date().toISOString().split("T")[0];

  // Find the attendance record by staff_id and date
  let attendance = await Attendance.findOne({ staff_id: user, date: attendanceDate });

  if (attendance) {
    // If attendance exists, update it
    attendance.hour = hour;
    attendance.minute = minute;
    attendance.leave = leave;
    attendance = await attendance.save();
  } else {
    // If attendance does not exist, create a new one
    attendance = await Attendance.create({
      staff_id: user,
      date: attendanceDate,
      hour,
      minute,
      leave,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});


module.exports = {
  createAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  getMyAttendance,
  getMonthlyAttendance,
  createLeave,
  createOrUpdateAttendance
};
