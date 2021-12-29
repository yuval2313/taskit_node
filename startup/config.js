const dotenv = require("dotenv");
const nodeEnv = process.env.NODE_ENV;
// FIXME:
// load different variables based on environment
// throw error if required viriables are not defined
if (nodeEnv !== "production") dotenv.config();
