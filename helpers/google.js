const HttpError = require("../errors/HttpError");
const { User } = require("../models/user");
const { google } = require("googleapis");

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;

const client = new google.auth.OAuth2({
  clientId,
  clientSecret,
  redirectUri,
});

async function validateToken(token) {
  if (!token)
    throw new HttpError({
      statusCode: 401,
      message: "No Authentication Provided!",
    });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    return ticket.getPayload();
  } catch (ex) {
    throw new HttpError({
      statusCode: 400,
      message: "Invalid Authentication!",
    });
  }
}

async function storeRefreshToken(code, userId) {
  const user = await User.findById(userId);

  const { tokens } = await client.getToken(code);
  if (!tokens)
    throw new HttpError({
      statusCode: 400,
      message: "Invalid code provided",
    });

  user.refreshToken = tokens.refresh_token;
  return await user.save();
}

async function createEvent(refreshToken, eventBody) {
  client.setCredentials({ refresh_token: refreshToken });

  const gcal = google.calendar("v3");

  try {
    return await gcal.events.insert({
      auth: client,
      calendarId: "primary",
      requestBody: eventBody,
    });
  } catch (err) {
    if (err && err.message === "invalid_grant")
      throw new HttpError({
        statusCode: 403,
        message: "Invalid refresh token",
      });
  }
}

module.exports.validateToken = validateToken;
module.exports.storeRefreshToken = storeRefreshToken;
module.exports.createEvent = createEvent;
