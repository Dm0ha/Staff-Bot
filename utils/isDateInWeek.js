const moment = require("moment");

const isDateInWeek = (date) => {
  const now = moment()
  const then = moment(date)

  return ((now.week() +1 == then.week() +1) && (now.year() +1 == then.year() +1))
}

module.exports = isDateInWeek;