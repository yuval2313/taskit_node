const dotenv = require("dotenv");
const logger = require("./logging");
dotenv.config();

const {
  NODE_ENV,
  PORT,
  JWTKEY,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
} = process.env;

if (!JWTKEY)
  throw new Error("JWTKEY is undefined! Please configure a private key.");

if (!PORT)
  throw new Error("PORT is undefined! Please configure a port for connection.");

if (!OAUTH_CLIENT_ID)
  throw new Error(
    "OAUTH_CLIENT_ID is undefined! Please configure your OAuth client ID."
  );
if (!OAUTH_CLIENT_SECRET)
  throw new Error(
    "OAUTH_CLIENT_SECRET is undefined! Please configure your OAuth client secret."
  );
if (!OAUTH_REDIRECT_URI)
  throw new Error(
    "OAUTH_REDIRECT_URI is undefined! Please configure a redirect URI to your frontend application."
  );

if (!NODE_ENV || NODE_ENV === "development") {
  const { DB_URL } = process.env;
  if (!DB_URL)
    throw new Error(
      "DB_URL is undefined! Please set your database connection string."
    );
  logger.debug(
    `To enable database replica sets in development (for use with transactions): Please configure DBURL with MongoDB connection string to a live database.`
  );
}
if (NODE_ENV === "production") {
  const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

  if (!DB_HOST)
    throw new Error(
      "DB_HOST is undefined! Please set your MongoDB host where your database is running."
    );
  if (!DB_USERNAME)
    throw new Error(
      "DB_USERNAME is undefined! Please set your MongoDB username."
    );
  if (!DB_PASSWORD)
    throw new Error(
      "DB_PASSWORD is undefined! Please set your MongoDB password."
    );
}
