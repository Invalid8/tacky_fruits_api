"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var path = require("path");

var _require = require("date-fns"),
    format = _require.format;

var fs = require("fs");

var fsPromises = require("fs").promises;

function EventLogger(event, title, refrence) {
  return regeneratorRuntime.async(function EventLogger$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (event) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(createFolder());

        case 4:
          // add new event log
          fs.appendFile(path.join(__dirname, "..", "logs", "event.log"), logFormat(event, title, refrence), function (error) {
            if (error) {
              throw error;
            }
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function ErrorLogger(event, title, refrence) {
  return regeneratorRuntime.async(function ErrorLogger$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (event) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return");

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(createFolder());

        case 4:
          // add new event log along with date
          fs.appendFile(path.join(__dirname, "..", "logs", "error.log"), logFormat(event, title, refrence), function (error) {
            if (error) {
              throw error;
            }
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function createFolder(pathname) {
  return regeneratorRuntime.async(function createFolder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!pathname) pathname = path.join(__dirname, "..", "logs");
          _context3.prev = 1;

          if (fs.existsSync(path.join(pathname))) {
            _context3.next = 5;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(fsPromises.mkdir(path.join(pathname)));

        case 5:
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);

          if (!_context3.t0) {
            _context3.next = 11;
            break;
          }

          throw _context3.t0;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 7]]);
}

function logFormat(log, title, refrence) {
  if (!log) return;
  var isArray = _typeof(log) == "object";

  if (isArray) {
    try {
      log = log.map(function (l) {
        l = JSON.stringify(l);
        return l;
      }).join("\n\t- ");
    } catch (_unused) {
      log = JSON.stringify(log);
    }
  }

  var template = "".concat(format(Date.now(), "[hh:mma]•[MM/dd/yyyy]\t"), title ? "-\t\"".concat(title, "\"\t-") : "", refrence ? "\t(".concat(refrence, ")") : "", "\n\t", isArray ? "- " : "", log, "\n");
  return template;
} // EventLogger(
//   {
//     id: "2leRnJRfIKGpU9AeAAAB",
//     name: "ola",
//     character: {
//       id: 9,
//       key: "carrot",
//       value_e: "🥕",
//       value: "/carrot111.35548f31.svg",
//       color: "#fc9502d8",
//     },
//     role: "PLAYER",
//   },
//   "player 1",
//   "./rest/people/user"
// );


module.exports = {
  EventLogger: EventLogger,
  ErrorLogger: ErrorLogger
};