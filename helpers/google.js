const HttpError = require("../errors/HttpError");
const { User } = require("../models/user");
const { google } = require("googleapis");

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;
const calendarId = "primary";

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
      statusCode: 401,
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

  const { sub: googleId } = await validateToken(tokens.id_token);
  if (user.googleId !== googleId)
    throw new HttpError({
      statusCode: 400,
      message: "Incorrect account",
    });

  user.refreshToken = tokens.refresh_token;
  return await user.save();
}

async function revokeRefreshToken(userId) {
  const user = await User.findById(userId);
  user.refreshToken = undefined;
  return await user.save();
}

async function gcalWrapper(method, refreshToken, config) {
  client.setCredentials({ refresh_token: refreshToken });

  const gcal = google.calendar("v3");

  try {
    return await gcal.events[method]({ auth: client, calendarId, ...config });
  } catch (ex) {
    if (ex && ex.message === "invalid_grant")
      throw new HttpError({
        statusCode: 403,
        message: "Invalid refresh token",
      });
    else
      throw new HttpError({
        statusCode: ex.response.status,
        message: ex.message,
      });
  }
}

async function createEvent(refreshToken, eventBody) {
  return await gcalWrapper("insert", refreshToken, {
    requestBody: eventBody,
  });
}

async function getTaskItEvents(refreshToken) {
  return await gcalWrapper("list", refreshToken, {
    privateExtendedProperty: ["taskIt=true"],
  });
}

async function deleteEvent(refreshToken, eventId) {
  return await gcalWrapper("delete", refreshToken, {
    eventId,
  });
}

async function updateEvent(refreshToken, eventBody, eventId) {
  return await gcalWrapper("update", refreshToken, {
    eventId,
    resource: eventBody,
  });
}

module.exports.validateToken = validateToken;
module.exports.storeRefreshToken = storeRefreshToken;
module.exports.revokeRefreshToken = revokeRefreshToken;
module.exports.createEvent = createEvent;
module.exports.getTaskItEvents = getTaskItEvents;
module.exports.deleteEvent = deleteEvent;
module.exports.updateEvent = updateEvent;
