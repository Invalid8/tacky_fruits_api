const moment = require("moment");

function formatMessage(username, text, isFailure = false) {
  return {
    username,
    text,
    time: moment().format("h : m a"),
    failure: isFailure,
  };
}

module.exports = { formatMessage };
