const path = require("path");
const { format } = require("date-fns");
const fs = require("fs");
const fsPromises = require("fs").promises;

async function EventLogger(event, title, refrence) {
  if (!event) return;

  // check for logs folder
  await createFolder();

  // add new event log
  fs.appendFile(
    path.join(__dirname, "..", "logs", "event.log"),
    logFormat(event, title, refrence),
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
}

async function ErrorLogger(event, title, refrence) {
  if (!event) return;

  // check for logs folder
  await createFolder();

  // add new event log along with date
  fs.appendFile(
    path.join(__dirname, "..", "logs", "error.log"),
    logFormat(event, title, refrence),
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
}

async function createFolder(pathname) {
  if (!pathname) pathname = path.join(__dirname, "..", "logs");

  try {
    if (!fs.existsSync(path.join(pathname))) {
      await fsPromises.mkdir(path.join(pathname));
    }
  } catch (error) {
    if (error) {
      throw error;
    }
  }
}

function logFormat(log, title, refrence) {
  if (!log) return;
  const isArray = typeof log == "object";

  if (isArray) {
    try {
      log = log
        .map((l) => {
          l = JSON.stringify(l);
          return l;
        })
        .join("\n\t- ");
    } catch {
      log = JSON.stringify(log);
    }
  }

  const template = "".concat(
    format(Date.now(), "[hh:mma]•[MM/dd/yyyy]\t"),
    title ? `-\t"${title}"\t-` : "",
    `\t(${__dirname})`,
    "\n\t",
    isArray ? "- " : "",
    log,
    "\n"
  );

  return template;
}

// EventLogger(
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

