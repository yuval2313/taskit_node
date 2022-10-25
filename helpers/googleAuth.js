const HttpError = require("../errors/HttpError");
const { OAuth2Client } = require("google-auth-library");
const clientId = process.env.OAUTH_CLIENT_ID;

async function validateToken(token) {
  const client = new OAuth2Client(clientId);

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

module.exports.validateToken = validateToken;
