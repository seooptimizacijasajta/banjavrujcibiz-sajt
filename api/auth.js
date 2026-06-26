module.exports = (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end("Missing OAUTH_CLIENT_ID environment variable.");
    return;
  }
  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo,user",
  });
  res.statusCode = 302;
  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.end();
};
