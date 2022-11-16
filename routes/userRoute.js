const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require('../Models/userModules');
const doctorModel = require("../Models/doctorModels")
const authMiddleware = require('../middleware/middleware')
const appointmentsModel= require('../Models/appointments')
const jwt = require("jsonwebtoken");
const moment = require("moment");


router.post("/register", async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    } else {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newuser = new userModel(req.body);
      await newuser.save();
      res
        .status(200)
        .send({ message: "User created successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});
router.post("/login", async (req, res) => {

  try {
    let userData = await userModel.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(200)
        .send({ message: "Invalid Email Id", success: false })
    } else {
      // let  UserloginData=req.body;
      const isMatch = await bcrypt.compare(req.body.password, userData.password);
      if (!isMatch) {
        return res.status(200)
          .send({ message: "Incorrect Password", success: false })
      } else {
        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
          expiresIn: "1d"
        });
        return res.status(200)
          .send({ message: "Login Succesfully", success: true, data: token })
      };
    };
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send({ message: "Error Logging in ", success: false })
  }
});
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});
router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName
      },
      onClickPath: "/admin/doctorslist",
    })
    await userModel.findByIdAndUpdate(adminUser._id, { unseenNotifications })
    res.status(200).send({
      success: true,
      message: "Doctor account Created successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error applying Doctor account", success: false, error });
  }
});
router.post("/mark-all-notification-as-seen", authMiddleware, async (req, res) => {
  try {
     const user= await userModel.findOne({_id:req.body.userId});
     const unseenNotifications=user.unseenNotifications;
    const seenNotifications=user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications=[]
    user.seenNotifications=seenNotifications;
    const updatedUser= await user.save();
    updatedUser.password=undefined;
    res.status(200).send({
      success:true,
      message:"All notifications marked as seen",
      data:updatedUser,
    })
} catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error", success: false, error });
  }
});
router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user= await userModel.findOne({_id:req.body.userId});
     user.seenNotifications=[];
     user.unseenNotifications=[];
     const updatedUser= await userModel.findByIdAndUpdate(user._id,user);
       updatedUser.password=undefined;
     res.status(200
      ).send({
      success:true,
      message:"Succesful",
      data:updatedUser,
    })
} catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error", success: false, error });
  }
});
router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await appointmentsModel.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new appointmentsModel(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his userid
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentsModel.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await appointmentsModel.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});
module.exports = router