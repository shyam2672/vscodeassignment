const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Fees = require("../models/Fees");
const Slot = require("../models/Slot");
const session = require('express-session');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const User = require("../models/User");

module.exports.getClinicInfo = async (req, res, next) => {
  try {
    // Assuming you want to get clinic information based on the clinic ID in the request parameters
    const clinicId = req.body.clinicId; // Adjust this according to your route configuration
    console.log("dsfd");
    // Find clinic by ID
    const c = await Clinic.findById(clinicId);

    // Check if clinic exists
    if (!c) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // If clinic exists, send the clinic information in the response
    res.json({ status: 200, clinic: c });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error fetching clinic information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createClinic = async (req, res, next) => {
  console.log(req.body);
  try {
    let name = req.body.name;
    let address = req.body.address;
    let contactNumber = req.body.contactNumber;
    let email = req.body.email;
    let c;
    try {
      c = await Clinic.create({
        name: name,
        address: address,
        contactNumber: contactNumber,
        email: email,
      });
      // console.log('User created:', user);
    } catch (error) {
      console.error("Error creating clinic:", error);
    }

    res.json({ status: true, clinic: c });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getDoctor = async (req, res, next) => {
  try {
    // Assuming you want to get doctor information based on the doctor ID in the request parameters
    console.log(req.body);
    const doctorId = req.body.doctorID; // Adjust this according to your route configuration
    console.log(doctorId);
    // Find doctor by ID
    const foundDoctor = await Doctor.findById(doctorId);

    // Check if doctor exists
    if (!foundDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // If doctor exists, send the doctor information in the response
    res.json({ status: 200, doctor: foundDoctor });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error fetching doctor information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createDoctor = async (req, res, next) => {
  try {
    let name = req.body.name;
    let specializations = req.body.specializations;
    let contactNumber = req.body.contactNumber;
    let email = req.body.email;
    let degrees = req.body.degrees;
    let clinicID = req.body.clinicID;

    try {
      d = await Doctor.create({
        name: name,
        specializations: specializations,
        degrees: degrees,
        nextAvailibility: null,
        clinicID: clinicID,
        contactNumber: contactNumber,
        email: email,
      });
      // console.log('Doctor created:', doctor);
    } catch (error) {
      console.error("Error creating doctor:", error);
    }

    res.json({ status: true, doctor: d });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.setNextAvailability = async (req, res, next) => {
  try {
    console.log(req.body);
    const doctorID = req.body.doctorID; // Assuming you get the doctorId from the route parameters
    const nextAvailability = req.body.nextAvailibility; // Assuming you get the nextAvailability from the request body
    console.log(doctorID);

    console.log(nextAvailability);
    console.log("dfghf");

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorID);

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Set the nextAvailability for the doctor
    doctor.nextAvailibility = nextAvailability;

    // Save the updated doctor
    await doctor.save();

    res.json({ status: true, doctor: doctor });
  } catch (error) {
    console.error("Error setting nextAvailability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports.setFees = async (req, res, next) => {
  try {
    let clinicID = req.body.clinicID; // Assuming you get the clinicID from the route parameters
    let mode=req.body.mode;
    let amount  = req.body.amount;

    // Check if fees already exist for the clinic
    let fees = await Fees.findOne({ clinicID: clinicID, mode: mode });

    // If fees exist, update them; otherwise, create new fees
    if (fees) {
      fees.amount = amount;
    } else {
      fees = new Fees({
        mode: mode,
        clinicID: clinicID,
        amount: amount,
      });
    }

    // Save the updated or new fees
    await fees.save();

    res.json({ status: true, fees: fees });
  } catch (error) {
    console.error('Error setting fees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.getFees = async (req, res, next) => {
  try {
    let clinicID = req.body.clinicID; // Assuming you get the clinicID from the route parameters
   let mode=req.body.mode;
    // Find fees by clinic ID
    const fees = await Fees.find({ clinicID: clinicID,mode :mode });

    res.json({ status: true, fees: fees });
  } catch (error) {
    console.error('Error getting fees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports.getUser = async (req, res, next) => {
  try {
    const userId = req.body.userId; // Assuming you get the userId from the route parameters

    // Find user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ status: true, user: user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.createUser = async (req, res, next) => {
  try {
    const { username, name, email, contactNumber,password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user with the same email or contactNumber already exists
    const existingUser = await User.findOne({ $or: [{ email: email }, { contactNumber: contactNumber }] });

    if (existingUser) {
      return res.status(400).json({ error: "User with the same email or contact number already exists" });
    }

    // Create a new user instance
    const newUser = new User({
      username: username,
      name: name,
      email: email,
      contactNumber: contactNumber,
      password: hashedPassword,
      // You can add other properties as needed
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ status: true, user: savedUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.login = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // console.log(user);
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    // console.log(user.password);
    isPasswordValid = await bcrypt.compare(password, user.password);
    //  isPasswordValid = await(password == user.password)
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    // if (user.isVerified == false)
    //   return res.json({ msg: "Email not verified", status: false });
    user.token = generateToken(user._id);

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


module.exports.createSlot = async (req, res, next) => {
  try {
  let mode=req.body.mode;
  let clinicID=req.body.clinicID;
  let date=new Date(req.body.date);
  let time=req.body.time;

    // Create a new slot instance
    const newSlot = new Slot({
      clinicID: clinicID,
      time: time,
      date: date,
      mode: mode,
      isBooked: false, // Assuming the slot is initially not booked
      // You can add other properties as needed
      userid: null,
    });



    // Save the new slot to the database
    const savedSlot = await newSlot.save();

    res.status(201).json({ status: true, slot: savedSlot });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.getSlots= async (req, res, next) => {
  try {
    const clinicID = req.body.clinicID; // Assuming you get the clinicID from the route parameters
    const mode=req.body.mode;
    const requestedDate = new Date(req.body.date); // Assuming you get the date from the route parameters
    
    console.log(requestedDate);
    // Find slots for the specified clinic and date
    const slotsOnDate = await Slot.find({
      clinicID: clinicID,
      mode: mode,
      date: requestedDate,
    });

    res.json({ status: true, slots: slotsOnDate });
  } catch (error) {
    console.error('Error getting slots on date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.bookSlot = async (req, res, next) => {
  try {
    const slotID = req.body.slotID; // Assuming you get the slotID from the route parameters
    const userID= req.body.userID

    // Find the slot by ID
    const slot = await Slot.findById(slotID);

    // Check if the slot exists
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Check if the slot is already booked
    if (slot.isBooked) {
      return res.status(400).json({ error: "Slot is already booked" });
    }

    slot.userid=userID;
    // Update the slot to mark it as booked
    slot.isBooked = true;

    // Save the updated slot
    await slot.save();

    res.json({ status: true, slot: slot });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const transporter = nodemailer.createTransport({
  // Set up your nodemailer configuration
  // Example using a Gmail account:
  service: 'gmail',
  auth: {
    user: 'sdp2002@gmail.com',
    pass: 'sdp2002',
  },
});

// Function to validate OTP (replace with your OTP validation logic)
function validateOTP(user, enteredOTP) {
  // Implement your OTP validation logic
  // For example, compare enteredOTP with the OTP stored in the user document
  return user.otp === enteredOTP;
}


// Endpoint to initiate the OTP sending process
module.exports.sendOTP = async (req,res,next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

    // Send OTP to the user's email
    const mailOptions = {
      from: 'sdp2002@gmail.com',
      to: user.email,
      subject: 'Verification OTP',
      text: `Your OTP for slot booking is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Store the OTP in the user document for validation
    user.otp = otp;
    await user.save();

    return res.json({ status: 'success', message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};






const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};