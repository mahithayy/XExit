const Resignation = require("../models/Resignation");
const Questionnaire = require("../models/Questionnaire");
const { isWorkingDay } = require("../utils/calendarific");
const nodemailer = require("../utils/mailer");

exports.submitResignation = async (req, res) => {
  try {
    const { lwd } = req.body;
    const userId = req.user.userId;

    const valid = await isWorkingDay(lwd);
    if (!valid) return res.status(400).json({ message: "LWD must be a working day." });

    const resignation = new Resignation({ employeeId: userId, lwd, status: "pending" });
    await resignation.save();

    res.status(200).json({
  message: "Resignation submitted successfully",
  resignation: { _id: resignation._id }
});


  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { responses } = req.body;

    const record = new Questionnaire({ employeeId: userId, responses });
    await record.save();

    res.status(200).json({ message: "Responses submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
