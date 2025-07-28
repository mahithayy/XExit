const Resignation = require("../models/Resignation");
const Interview = require("../models/Interview");
const nodemailer = require("../utils/mailer");
const Response = require("../models/Response");
exports.getPendingResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find({ status: "pending" }).populate("employeeId", "username");
    //res.status(200).json({ data: { resignations } });
    res.status(200).json(resignations);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.processResignation = async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ message: "Invalid approval value" });
    }

    const status = approved ? "approved" : "rejected";

    const updated = await Resignation.findByIdAndUpdate(
      resignationId,
      { status, lwd },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Resignation not found" });

    await nodemailer.notifyEmployee(updated.employeeId, status);

    res.status(200).json({ message: `Resignation ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.scheduleInterview = async (req, res) => {
  try {
    const { resignationId, date } = req.body;

    const interview = new Interview({ resignationId, date });
    await interview.save();

    res.status(200).json({ message: "Interview scheduled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExitResponses = async (req, res) => {
  try {
    const data = await Response.find().populate("employeeId", "email _id");
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
