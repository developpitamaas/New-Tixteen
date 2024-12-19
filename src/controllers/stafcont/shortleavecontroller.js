const ShortLeave = require("../../models/staff/shortleave");
const Trycatch = require("../../middleware/trycatch");
const Attendance = require("../../models/staff/attendance");
const Addstaf = require("../../models/staff/addstaf");

// Start short leave
// const startShortLeave = Trycatch(async (req, res, next) => {
//   const staff_id = req.user.user;
//   const leave_from = new Date().toISOString();

//   const shortleave = await ShortLeave.create({
//     leave_from,
//     staff_id,
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       shortleave,
//     },
//   });
// });

// // Stop short leave
// const stopShortLeave = Trycatch(async (req, res, next) => {
//   const { id } = req.params;
//   const leave_to = new Date().toISOString();

//   const shortleave = await ShortLeave.findByIdAndUpdate(
//     id,
//     { leave_to },
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({
//     status: "success",
//     data: {
//       shortleave,
//     },
//   });
// });

// Utility function to get the stop time (18:30) and the current time
const getTimeWith18_30 = () => {
  const now = new Date();
  const stopTime = new Date();
  stopTime.setHours(18, 30, 0, 0); // 18:30
  return { now, stopTime };
};

const startShortLeave = Trycatch(async (req, res, next) => {
  const staff_id = req.user.user;

  // Convert current time to IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  // Get 18:30 IST
  const stopTime = new Date(istNow);
  stopTime.setHours(18, 30, 0, 0);

  // if (istNow > stopTime) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "Cannot start short leave after 18:30",
  //   });
  // }

  const leave_from = istNow.toISOString();

  const shortleave = await ShortLeave.create({
    leave_from,
    staff_id,
  });

  // Calculate the time remaining until 18:30 IST
  const timeUntil18_30 = stopTime - istNow;

  // Set a timeout to stop the short leave at 18:30 if not stopped manually
  setTimeout(async () => {
    const existingShortLeave = await ShortLeave.findById(shortleave._id);
    if (existingShortLeave && !existingShortLeave.leave_to) {
      existingShortLeave.leave_to = stopTime.toISOString();
      await existingShortLeave.save();
    }
  }, timeUntil18_30);

  res.status(201).json({
    status: "success",
    data: {
      shortleave,
    },
  });
});

const stopShortLeave = Trycatch(async (req, res, next) => {
  const { id } = req.params;

  // Convert current time to IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  const leave_to = istNow.toISOString();

  const shortleave = await ShortLeave.findByIdAndUpdate(
    id,
    { leave_to },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      shortleave,
    },
  });
});
const startShortLeaveWithTime = Trycatch(async (req, res, next) => {
  const { leave_from , staff_id } = req.body;  // Extracting leave_from time from request body

  const shortleave = await ShortLeave.create({
    leave_from,
    staff_id,
  });

  res.status(201).json({
    status: "success",
    data: {
      shortleave,
    },
  });
});

const stopShortLeaveWithTime = Trycatch(async (req, res, next) => {
  const { id } = req.params;
  const { leave_to } = req.body;  // Extracting leave_to time from request body

  const shortleave = await ShortLeave.findByIdAndUpdate(
    id,
    { leave_to },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      shortleave,
    },
  });
});




// Start short leave
// const startShortLeave = Trycatch(async (req, res, next) => {
//   const staff_id = req.user.user;
//   const { now, stopTime } = getTimeWith18_30();

//   if (now > stopTime) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Cannot start short leave after 18:30",
//     });
//   }

//   const leave_from = now.toISOString();

//   const shortleave = await ShortLeave.create({
//     leave_from,
//     staff_id,
//   });

//   // Calculate the time remaining until 18:30
//   const timeUntil18_30 = stopTime - now;

//   // Set a timeout to stop the short leave at 18:30 if not stopped manually
//   setTimeout(async () => {
//     const existingShortLeave = await ShortLeave.findById(shortleave._id);
//     if (existingShortLeave && !existingShortLeave.leave_to) {
//       existingShortLeave.leave_to = stopTime.toISOString();
//       await existingShortLeave.save();
//     }
//   }, timeUntil18_30);

//   res.status(201).json({
//     status: "success",
//     data: {
//       shortleave,
//     },
//   });
// });

// // Stop short leave
// const stopShortLeave = Trycatch(async (req, res, next) => {
//   const { id } = req.params;
//   const leave_to = new Date().toISOString();

//   const shortleave = await ShortLeave.findByIdAndUpdate(
//     id,
//     { leave_to },
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({
//     status: "success",
//     data: {
//       shortleave,
//     },
//   });
// });

// Get short leave status
const getShortLeaveStatus = Trycatch(async (req, res, next) => {
  const { staff_id } = req.params;

  const shortleave = await ShortLeave.findOne({ staff_id, leave_to: null });

  res.status(200).json({
    status: "success",
    data: {
      shortleave,
    },
  });
});

const getmyallshortleave = Trycatch(async (req, res, next) => {
  const shortleave = await ShortLeave.find({
    staff_id: req.params.id,
  });
  res.status(200).json({
    status: "success",
    count: shortleave.length,
    data: {
      shortleave,
    },
  });
});
const getTodayAttendance = Trycatch(async (req, res, next) => {
  const staff_id = req.user.user;
  const today = new Date().toISOString().split("T")[0];

  const attendance = await Attendance.findOne({ date: today, staff_id });
  const shortleave = await ShortLeave.findOne({ staff_id, leave_to: null });

  res.status(200).json({
    status: "success",
    data: {
      attendance,
      shortleave,
    },
  });
});

const getMonthlyAttendanceData = Trycatch(async (req, res, next) => {
  const staff_id = req.params.staff_id || req.user.user;
  const { month, year } = req.query;

  const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
  const lastDay = new Date(selectedYear, selectedMonth, 0);
  const totalDaysInMonth = lastDay.getDate();

  // Fetch attendance records within the selected month
  const attendanceRecords = await Attendance.find({
    staff_id,
    date: { 
      $gte: firstDay.toISOString().split("T")[0], 
      $lte: lastDay.toISOString().split("T")[0] 
    },
  });

  // Fetch staff salary details
  const salaryData = await Addstaf.findOne({ username: staff_id });
  const baseSalary = parseFloat(salaryData.basicsalary).toFixed(2);
  const perDaySalary = parseFloat((baseSalary / totalDaysInMonth).toFixed(2));
  const perMinuteSalary = parseFloat((perDaySalary / 540).toFixed(2)); // Assuming 9 hours per day

  // Initialize counters
  let fullDayCount = 0;
  let halfDayCount = 0;
  let leaveDayCount = 0;
  let totalShortLeaveMinutes = 0;
  let totalDelayMinutes = 0;
  let totalDeduction = 0; // Total deductions to be subtracted from base salary

  // Generate all dates in the month
  const reportDates = [];
  let currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
    reportDates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fetch short leave records within the selected month
  const shortLeaves = await ShortLeave.find({
    staff_id,
    leave_from: {
      $gte: firstDay.toISOString(),
      $lte: lastDay.toISOString(),
    },
  });

  const dayDetails = [];

  for (const date of reportDates) {
    const dayOfWeek = new Date(date).getDay(); // 0 (Sunday) to 6 (Saturday)
    const attendance = attendanceRecords.find(record => record.date === date);

    let logintime = '-';
    let shortLeaveMinutes = 0;
    let delayMinutes = 0;
    let status = '';
    let salaryDeduction = 0;

    if (attendance) {
      if (attendance.IsLeave) {
        // On Leave
        leaveDayCount++;
        status = 'on leave';
        salaryDeduction += perDaySalary;
      } else {
        // Present
        logintime = `${attendance.hour}:${attendance.minute}`;
        const loginTime = new Date(`${date}T${attendance.hour}:${attendance.minute}:00`);
        const scheduledTime = staff_id === "admin" ? new Date(`${date}T10:00:00`) : new Date(`${date}T09:30:00`);
        const halfDayThreshold = new Date(`${date}T10:30:00`);

        if (loginTime > scheduledTime) {
          if (loginTime > halfDayThreshold) {
            // Half Day
            halfDayCount++;
            status = 'half day';
            salaryDeduction += perDaySalary / 2;
          } else {
            // Full Day with Delay
            fullDayCount++;
            delayMinutes = Math.round((loginTime - scheduledTime) / 60000); // Delay in minutes
            totalDelayMinutes += delayMinutes;
            status = 'full day with delay';
            salaryDeduction += delayMinutes * perMinuteSalary;
          }
        } else {
          // Full Day
          fullDayCount++;
          status = 'full day';
        }

        // Check for Short Leaves
        const shortLeaveResults = shortLeaves.filter(leave => {
          const leaveFromDate = new Date(leave.leave_from).toISOString().split('T')[0];
          return leaveFromDate === date;
        });

        shortLeaveResults.forEach(leave => {
          const leaveFrom = new Date(leave.leave_from);
          const leaveTo = leave.leave_to && leave.leave_to !== '0000-00-00 00:00:00.000000'
            ? new Date(leave.leave_to)
            : new Date(`${date}T18:30:00`);
          shortLeaveMinutes += Math.round((leaveTo - leaveFrom) / 60000); // Short leave in minutes
        });

        totalShortLeaveMinutes += shortLeaveMinutes;
        salaryDeduction += perMinuteSalary * shortLeaveMinutes;
      }
    } else if (dayOfWeek === 0 || isThirdSaturday(date)) {
      // Weekend
      status = 'weekend';
      // No deduction for weekends
    } else {
      // Absent
      leaveDayCount++;
      status = 'absent';
      salaryDeduction += perDaySalary;
    }

    // Accumulate total deductions
    totalDeduction += salaryDeduction;

    dayDetails.push({
      date,
      logintime,
      status,
      shortLeaveMinutes,
      delayMinutes,
      salaryDeduction: salaryDeduction.toFixed(2),
      dailySalary: (perDaySalary - (salaryDeduction)).toFixed(2), // Not strictly necessary, but included for detail
    });
  }

  // Calculate total deductions for delays and short leaves
  const delayAmount = parseFloat((perMinuteSalary * totalDelayMinutes).toFixed(2));
  const shortLeaveAmount = parseFloat((perMinuteSalary * totalShortLeaveMinutes).toFixed(2));

  // Calculate total salary: baseSalary - (absent + half-days + delays + short leaves)
  // Note: leaveDayCount includes both 'on leave' and 'absent' statuses
  const totalSalary = parseFloat((baseSalary - (leaveDayCount * perDaySalary) - (halfDayCount * (perDaySalary / 2)) - delayAmount - shortLeaveAmount).toFixed(2));

  res.status(200).json({
    user: req.user.user,
    salary: baseSalary,
    perDaySalary: perDaySalary.toFixed(2),
    perMinuteSalary: perMinuteSalary.toFixed(2),
    fullDayCount,
    halfDayCount,
    leaveDayCount,
    totalShortLeaveMinutes,
    totalDelayMinutes,
    totalSalary: totalSalary.toFixed(2),
    dayDetails
  });
});


const getMonthlyAttendanceDataWorking  = Trycatch(async (req, res, next) => {
  const staff_id = req.params.staff_id || req.user.user;
  const { month, year } = req.query;

  const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
  const lastDay = new Date(selectedYear, selectedMonth, 0);
  const totalDaysInMonth = lastDay.getDate();

  // Fetch attendance records within the selected month
  const attendanceRecords = await Attendance.find({
      staff_id,
      date: { 
          $gte: firstDay.toISOString().split("T")[0], 
          $lte: lastDay.toISOString().split("T")[0] 
      },
  });


  // Fetch staff salary details
  const salaryData = await Addstaf.findOne({ username: staff_id });
  const baseSalary = parseFloat(salaryData.basicsalary).toFixed(2);
  const perDaySalary = parseFloat((baseSalary / totalDaysInMonth).toFixed(2));
  const perMinuteSalary = parseFloat((perDaySalary / 540).toFixed(2)); // Assuming 9 hours per day

  // Initialize counters
 
  let fullDayCount = 0;
  let halfDayCount = 0;
  let leaveDayCount = 0;
  let totalShortLeaveMinutes = 0;
  let totalDelayMinutes = 0;
  let totalDeduction = 0; // Total deductions to be subtracted from base salary

  // Generate all dates in the month
  const reportDates = [];
  let currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
      reportDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
  }

  const dayDetails = [];

  for (const date of reportDates) {
      const dayOfWeek = new Date(date).getDay(); // 0 (Sunday) to 6 (Saturday)
      const attendance = attendanceRecords.find(record => record.date === date);

      let logintime = '-';
      let shortLeaveMinutes = 0;
      let delayMinutes = 0;
      let status = '';
      let salaryDeduction = 0;

      if (attendance) {
          if (attendance.IsLeave) {
              // On Leave
              leaveDayCount++;
              status = 'on leave';
              salaryDeduction += perDaySalary;
          } else {
              // Present
              logintime = `${attendance.hour}:${attendance.minute}`;
              const loginTime = new Date(`${date}T${attendance.hour}:${attendance.minute}:00`);
              const scheduledTime = staff_id === "admin" ? new Date(`${date}T10:00:00`) : new Date(`${date}T09:30:00`);
              const halfDayThreshold = new Date(`${date}T10:30:00`);

              if (loginTime > scheduledTime) {
                  if (loginTime > halfDayThreshold) {
                      // Half Day
                      halfDayCount++;
                      status = 'half day';
                      salaryDeduction += perDaySalary / 2;
                  } else {
                      // Full Day with Delay
                      fullDayCount++;
                      delayMinutes = Math.round((loginTime - scheduledTime) / 60000); // Delay in minutes
                      totalDelayMinutes += delayMinutes;
                      status = 'full day with delay';
                      salaryDeduction += delayMinutes * perMinuteSalary;
                  }
              } else {
                  // Full Day
                  fullDayCount++;
                  status = 'full day';
              }

              // Check for Short Leaves
              const shortLeaveResult = await ShortLeave.findOne({
                  staff_id,
                  LeaveFrom: { 
                      $gte: new Date(`${date}T00:00:00`), 
                      $lte: new Date(`${date}T23:59:59`) 
                  }
              });

              if (shortLeaveResult) {
                  const leaveFrom = new Date(shortLeaveResult.LeaveFrom);
                  const leaveTo = shortLeaveResult.LeaveTo && shortLeaveResult.LeaveTo !== '0000-00-00 00:00:00.000000'
                      ? new Date(shortLeaveResult.LeaveTo)
                      : new Date(`${date}T18:30:00`);
                  shortLeaveMinutes = Math.round((leaveTo - leaveFrom) / 60000); // Short leave in minutes
                  totalShortLeaveMinutes += shortLeaveMinutes;
                  salaryDeduction += perMinuteSalary * shortLeaveMinutes;
              }
          }
      } else if (dayOfWeek === 0 || isThirdSaturday(date)) {
          // Weekend
          status = 'weekend';
          // No deduction for weekends
      } else {
          // Absent
          leaveDayCount++;
          status = 'absent';
          salaryDeduction += perDaySalary;
      }

      // Accumulate total deductions
      totalDeduction += salaryDeduction;

      dayDetails.push({
          date,
          logintime,
          status,
          shortLeaveMinutes,
          delayMinutes,
          salaryDeduction: salaryDeduction.toFixed(2),
          dailySalary: (perDaySalary - (salaryDeduction)).toFixed(2), // Not strictly necessary, but included for detail
      });
  }

  // Calculate total deductions for delays and short leaves
  const delayAmount = parseFloat((perMinuteSalary * totalDelayMinutes).toFixed(2));
  const shortLeaveAmount = parseFloat((perMinuteSalary * totalShortLeaveMinutes).toFixed(2));

  // Calculate total salary: baseSalary - (absent + half-days + delays + short leaves)
  // Note: leaveDayCount includes both 'on leave' and 'absent' statuses
  const totalSalary = parseFloat((baseSalary - (leaveDayCount * perDaySalary) - (halfDayCount * (perDaySalary / 2)) - delayAmount - shortLeaveAmount).toFixed(2));

  res.status(200).json({
      user: req.user.user,
      salary: baseSalary,
      perDaySalary: perDaySalary.toFixed(2),
      perMinuteSalary: perMinuteSalary.toFixed(2),
      fullDayCount,
      halfDayCount,
      leaveDayCount,
      totalShortLeaveMinutes,
      totalDelayMinutes,
      totalSalary: totalSalary.toFixed(2),
      dayDetails
  });
});





// Helper function to check if a date is the 3rd Saturday of the month
// Helper function to check if a date is the 3rd Saturday of the month
function isThirdSaturday(dateString) {
  const date = new Date(dateString); // Ensure date is a Date object
  const currentDay = date.getDate();
  let thirdSaturday = 0;
  for (let i = 1; i <= currentDay; i++) {
      const day = new Date(date.getFullYear(), date.getMonth(), i).getDay();
      if (day === 6) thirdSaturday++;
      if (thirdSaturday === 3) return i === currentDay;
  }
  return false;
}



// Helper function to check if a date is the 3rd Saturday of the month
function isThirdSaturday(dateString, year, month) {
  // Convert dateString to a Date object
  const date = new Date(dateString);
  
  // Check if the provided date is a Saturday
  if (date.getDay() !== 6) return false;

  let thirdSaturday = new Date(year, month - 1, 1);
  let saturdayCount = 0;

  // Loop through the days of the month to find the 3rd Saturday
  while (thirdSaturday.getMonth() === month - 1) {
      if (thirdSaturday.getDay() === 6) {
          saturdayCount++;
          if (saturdayCount === 3) break;
      }
      thirdSaturday.setDate(thirdSaturday.getDate() + 1);
  }

  // Return whether the provided date matches the 3rd Saturday
  return date.toDateString() === thirdSaturday.toDateString();
}



const getMonthlyAttendanceDataOld = Trycatch(async (req, res, next) => {
  let staff_id = req.params.staff_id || req.user.user;

  const { month, year } = req.query;

  const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();

  const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
  const lastDay = new Date(selectedYear, selectedMonth, 0);

  const attendanceRecords = await Attendance.find({
    staff_id,
    date: {
      $gte: firstDay.toISOString().split("T")[0],
      $lte: lastDay.toISOString().split("T")[0],
    },
  });

  const shortLeaves = await ShortLeave.find({
    staff_id,
    leave_from: {
      $gte: firstDay.toISOString(),
      $lte: lastDay.toISOString(),
    },
  });

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  let totalShortLeaveMinutes = 0;
  let totalActiveMinutes = 0;
  let totalHalfDays = 0;
  let totalFullDays = 0;

  const monthlyData = Array.from({ length: daysInMonth }, (_, day) => {
    const date = new Date(selectedYear, selectedMonth - 1, day + 1);
    const dateString = date.toISOString().split("T")[0];

    const attendance = attendanceRecords.find((a) => a.date === dateString);
    const shortLeaveMinutes = Math.floor(
      shortLeaves
        .filter((sl) => sl.leave_from.startsWith(dateString))
        .reduce((total, sl) => {
          const leaveFrom = new Date(sl.leave_from);
          const leaveTo = sl.leave_to ? new Date(sl.leave_to) : new Date();
          const diff = (leaveTo - leaveFrom) / (1000 * 60);
          return total + diff;
        }, 0)
    );

    totalShortLeaveMinutes += shortLeaveMinutes;

    let activeMinutes = 0;
    let status = "";

    if (attendance) {
      const attendanceTime = new Date(
        `${attendance.date}T${attendance.hour}:${attendance.minute}:00`
      );
      const startOfWorkDay = new Date(attendanceTime);
      startOfWorkDay.setHours(9, 30, 0, 0); // 09:30 AM

      const endOfWorkDay = new Date(attendanceTime);
      endOfWorkDay.setHours(18, 30, 0, 0); // 06:30 PM

      const now = new Date();
      const activeUntil = now < endOfWorkDay ? now : endOfWorkDay;

      if (attendanceTime < startOfWorkDay) {
        attendanceTime.setHours(9, 30, 0, 0); // If login before 09:30, count from 09:30
      }

      if (attendanceTime < endOfWorkDay) {
        activeMinutes =
          (activeUntil - attendanceTime) / (1000 * 60) - shortLeaveMinutes;
      }

      totalActiveMinutes += activeMinutes;

      // Determine the status based on login time
      if (
        attendanceTime.getHours() < 10 ||
        (attendanceTime.getHours() === 10 && attendanceTime.getMinutes() < 30)
      ) {
        status = "full day";
        totalFullDays += 1;
      } else {
        status = "half day";
        totalHalfDays += 1;
      }
    } else {
      status = "on leave";
    }

    return {
      date: dateString,
      loginTime: attendance ? `${attendance.hour}:${attendance.minute}` : "",
      shortLeaveMinutes: shortLeaveMinutes || 0,
      totalActiveMinutes: activeMinutes > 0 ? activeMinutes : 0,
      status,
    };
  });
  // find staff
  const staff = await Addstaf.findOne({ username: staff_id });

  res.status(200).json({
    // salary: staff ? staff.basicsalary : 0,
    salary: staff ? staff.basicsalary : 0,
    user: req.user.user,
    status: "success",
    data: monthlyData,
    totalShortLeaveMinutes,
    totalActiveMinutes,
    totalHalfDays,
    totalFullDays,
  });
});

const getMonthlyAttendanceDatas = async (req, res, next) => {
  try {
    const staff_id = req.params.staff_id || req.user.user;
    const { month, year } = req.query;
    const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);

    // all attadance
    const attendanceRecords = await Attendance.find({
      staff_id,
      date: {
        $gte: firstDay.toISOString().split("T")[0],
        $lte: lastDay.toISOString().split("T")[0],
      },
    });
    // all short leave
    const shortLeaves = await ShortLeave.find({
      staff_id,
      leave_from: {
        $gte: firstDay.toISOString(),
        $lte: lastDay.toISOString(),
      },
    });

    const staff = await Addstaf.findOne({ username: staff_id });
    const salary = Number(staff.basicsalary);
    const daysInMonth = lastDay.getDate();
    const workingDays = daysInMonth - 4; // 4 Sundays
    const perDaySalary = salary / workingDays;
    const workMinutesPerDay = 9.5 * 60; // 9.5 hours per day
    const perMinuteSalary = perDaySalary / workMinutesPerDay;

    let totalShortLeaveMinutes = 0;
    let totalActiveMinutes = 0;
    let totalHalfDays = 0;
    let totalFullDays = 0;
    let totalLeaves = 0;

    const monthlyData = attendanceRecords.map((attendance) => {
      const dateString = attendance.date;
      const attendanceTime = new Date(
        `${attendance.date}T${attendance.hour}:${attendance.minute}:00`
      );
      const startOfWorkDay = new Date(attendance.date);
      startOfWorkDay.setHours(9, 30, 0, 0);
      const endOfWorkDay = new Date(attendance.date);
      endOfWorkDay.setHours(18, 30, 0, 0);

      let activeMinutes = 0;
      let status = "on leave";

      if (attendanceTime < startOfWorkDay) {
        attendanceTime.setHours(9, 30, 0, 0); // Adjust if logged in before 9:30 AM
      }

      if (attendanceTime <= endOfWorkDay) {
        const now = new Date();
        const activeUntil = now < endOfWorkDay ? now : endOfWorkDay;
        activeMinutes = (activeUntil - attendanceTime) / (1000 * 60);
      }

      let shortLeaveMinutes = 0;
      shortLeaves.forEach((sl) => {
        const leaveFrom = new Date(sl.leave_from);
        const leaveTo = sl.leave_to
          ? new Date(sl.leave_to)
          : new Date(`${attendance.date}T18:30:00`);
        shortLeaveMinutes += (leaveTo - leaveFrom) / (1000 * 60);
      });

      activeMinutes -= shortLeaveMinutes;
      totalActiveMinutes += activeMinutes;
      totalShortLeaveMinutes += shortLeaveMinutes;

      // Determine if full or half day
      if (
        attendanceTime.getHours() < 10 ||
        (attendanceTime.getHours() === 10 && attendanceTime.getMinutes() < 30)
      ) {
        status = "full day";
        totalFullDays += 1;
      } else {
        status = "half day";
        totalHalfDays += 1;
      }

      return {
        date: dateString,
        loginTime: `${attendance.hour}:${attendance.minute}`,
        shortLeaveMinutes,
        totalActiveMinutes: activeMinutes > 0 ? activeMinutes : 0,
        status,
      };
    });

    totalLeaves = daysInMonth - (totalFullDays + totalHalfDays + 4); // Exclude Sundays

    const totalSalary = totalActiveMinutes * perMinuteSalary;

    res.status(200).json({
      salary,
      perDaySalary: perDaySalary.toFixed(2),
      perMinuteSalary: perMinuteSalary.toFixed(2),
      totalActiveMinutes,
      totalShortLeaveMinutes,
      totalHalfDays,
      totalFullDays,
      totalLeaves,
      totalSalary: totalSalary.toFixed(2),
      data: monthlyData,
    });
  } catch (error) {
    console.error("Error in calculating monthly attendance data", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  startShortLeave,
  stopShortLeave,
  getShortLeaveStatus,
  getmyallshortleave,
  getTodayAttendance,
  getMonthlyAttendanceData,
  startShortLeaveWithTime,
  stopShortLeaveWithTime,
};
