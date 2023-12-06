const router = require("express").Router();
const ctrl = require("../controller/controller.js");
const protect = require("../middlewares/authMiddleWare");


router.post("/addclinic", ctrl.createClinic);
router.post("/getclinic", ctrl.getClinicInfo);
router.post("/adddoctor", ctrl.createDoctor);
router.post("/getdoctor", ctrl.getDoctor);
router.post("/setavailibility", ctrl.setNextAvailability);
router.post("/getfees", ctrl.getFees);
router.post("/setfees", ctrl.setFees);
router.post("/getuser", ctrl.getUser);
router.post("/createuser", ctrl.createUser);
router.post("/createslot", ctrl.createSlot);
router.post("/getslots", ctrl.getSlots);
router.post("/bookslot",protect.protectstu, ctrl.bookSlot);
router.post("/login", ctrl.login);
router.post("/sendotp", ctrl.sendOTP);



module.exports = router;