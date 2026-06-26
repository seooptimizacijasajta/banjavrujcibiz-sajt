module.exports = async (req, res) => {
  const { code, error, error_description } = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  function renderScript(status, payload) {
    const message = JSON.stringify({ token: payload.token, provider: "github" });
    res.setHeader("Content-Type", "text/html");
    res.end(`<!doctype html><html><body><script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:${status}:${status === "success" ? message : JSON.stringify(payload)}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script></body></html>`);
  }

  if (error) {
    res.statusCode = 401;
    return renderScript("error", { error, error_description });
  }
  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    return renderScript("error", { error: "config", error_description: "Missing OAUTH_CLIENT_ID/OAUTH_CLIENT_SECRET" });
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();
    if (data.error) {
      res.statusCode = 401;
      return renderScript("error", { error: data.error, error_description: data.error_description });
    }
    return renderScript("success", { token: data.access_token });
  } catch (err) {
    res.statusCode = 500;
    return renderScript("error", { error: "exchange_failed", error_description: err.message });
  }
};
