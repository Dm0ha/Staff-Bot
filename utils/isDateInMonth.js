const moment = require("moment");

const isDateInMonth = (date) => {
  const now = moment()
  const then = moment(date)

  return ((now.month() +1 == then.month() +1) && (now.year() +1 == then.year() +1))
}

module.exports = isDateInMonth;