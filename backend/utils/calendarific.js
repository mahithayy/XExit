const axios = require("axios");
const moment = require("moment");

const isWorkingDay = async (dateStr, countryCode = "IN") => {
  const date = moment(dateStr);
  const dayOfWeek = date.isoWeekday();

  // Reject weekends (Saturday: 6, Sunday: 7)
  if (dayOfWeek >= 6) return false;

  const API_KEY = process.env.CALENDARIFIC_KEY;
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${date.year()}&month=${date.month() + 1}&day=${date.date()}`;

  try {
    const response = await axios.get(url);
    const holidays = response.data.response.holidays;

    if (holidays && holidays.length > 0) {
      return false; // It's a holiday
    }
    return true; // It's a working day
  } catch (error) {
    console.error("Calendarific error:", error.message);
    return false; // Fail-safe: treat unknowns as holidays
  }
};

module.exports = isWorkingDay;
