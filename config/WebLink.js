const production_url = "https://tackyfruitsapi-production.up.railway.app/";
const development_url = "http://localhost:7500";
const MAIN_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? development_url
    : production_url;

module.exports = MAIN_URL;
