const moment = require("moment");

const isDateInDay = (date) => {
  const now = moment()
  const then = moment(date)

  return ((now.dayOfYear() +1 == then.dayOfYear() +1) && (now.year() +1 == then.year() +1))
}

module.exports = isDateInDay;