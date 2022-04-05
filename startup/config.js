const dotenv = require("dotenv");
const nodeEnv = process.env.NODE_ENV;

if (!nodeEnv || nodeEnv === "development") {
  dotenv.config();
  console.log(
    `To enable database replica sets in development (for use with transactions); Please configure custom DBURL with MongoDB connection string.`
  );
}
if (nodeEnv === "production") {
  const { PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, JWTKEY } = process.env;

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

  if (!JWTKEY)
    throw new Error("JWTKEY is undefined! Please configure a private key.");

  if (!PORT)
    throw new Error(
      "PORT is undefined! Please configure a port for connection."
    );
}
