// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/Payments.js")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth.js")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", verifySignature)

module.exports = router