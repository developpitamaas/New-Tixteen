const express = require('express');
const Staff = express.Router();
const StaffController = require('../controllers/stafcont/staffController');
const Attendance = require('../controllers/stafcont/attendancecontoller');
const ShortLeave = require('../controllers/stafcont/shortleavecontroller');
const Auth = require('../middleware/Auth');


Staff.post('/add-staf', StaffController.AddStaf);
Staff.put('/update-staff/:id', StaffController.updateStaf);
Staff.delete('/delete-staf/:id', StaffController.deleteStaf);
Staff.get('/get-staf/:id', StaffController.getStaf);
Staff.get('/get-all-staff', StaffController.getAllStaf);

 
// attendance
Staff.post('/attendance/create', Auth.IsAuthenticateUser ,Attendance.createAttendance);
Staff.put('/update-attendance',Auth.IsAuthenticateUser, Attendance.updateAttendance);
Staff.post('/leave/create', Auth.IsAuthenticateUser ,Attendance.createAttendance);
Staff.post('/attendance/create-or-update', Auth.IsAuthenticateUser, Attendance.createOrUpdateAttendance);


Staff.get('/get-all-attendance', Attendance.getAllAttendance);
Staff.get('/get-single-attendance/:id', Attendance.getSingleAttendance);
Staff.delete('/delete-attendance/:id',Auth.IsAuthenticateUser, Attendance.deleteAttendance);

// short leave
Staff.post('/start-shortleave', Auth.IsAuthenticateUser ,ShortLeave.startShortLeave);
Staff.put('/stop-shortleave/:id',  ShortLeave.stopShortLeave);
Staff.get('/get-shortleave-status/:staff_id', ShortLeave.getShortLeaveStatus);
Staff.get('/get-my-all-shortleave/:id', ShortLeave.getmyallshortleave);
Staff.get('/get-today-attendance', Auth.IsAuthenticateUser ,ShortLeave.getTodayAttendance);
Staff.get('/get-monthly-attendance-data/:staff_id?',Auth.IsAuthenticateUser ,ShortLeave.getMonthlyAttendanceData);
// startShortLeavefrombody,
// stopShortLeavefrombody,
Staff.post('/start-shortleave-with-time', ShortLeave.startShortLeaveWithTime);
Staff.put('/stop-shortleave-with-time/:id', ShortLeave.stopShortLeaveWithTime);



module.exports = Staff




