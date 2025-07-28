const Resignation = require("../models/Resignation");
const Questionnaire = require("../models/Questionnaire");
const { isWorkingDay } = require("../utils/calendarific");
const nodemailer = require("../utils/mailer");

exports.submitResignation = async (req, res) => {
  try {
    console.log("Incoming resignation request");

    const { lwd, reason = "No reason provided" } = req.body;

    const isValid = await isWorkingDay(lwd);
    if (!isValid) {
      return res.status(400).json({ message: "Selected date is not a working day" });
    }

    const resignation = new Resignation({
      employeeId: req.user._id,
      lwd,
      reason,
      status: "pending",
    });

    await resignation.save();

    res.status(200).json({
      message: "Resignation submitted successfully",
      resignation: { _id: resignation._id },
    });
  } catch (err) {
    console.error("Submit resignation error:", err);
    console.error("Submit resignation error:", err);
  console.error("Request body:", req.body);
  console.error("User making request:", req.user);

    res.status(500).json({ message: "Server error" });
  }
};


exports.submitQuestionnaire = async (req, res) => {
  try {
    //const userId = req.user.userId;
    const userId = req.user._id;

    const { responses } = req.body;

    const record = new Questionnaire({ employeeId: userId, responses });
    await record.save();

    res.status(200).json({ message: "Responses submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
