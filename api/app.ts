import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_BACKEND_CLIENT_ID = process.env.AZURE_BACKEND_CLIENT_ID;

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

const jwksClient = jwksRsa({
  jwksUri: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/discovery/v2.0/keys`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error("Error getting signing key:", err);
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

app.get("/", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(
    token,
    getKey,
    {
      audience: AZURE_BACKEND_CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send("Unauthorized");
      }

      console.log("Token successfully verified:", decoded);

      return res.status(200).json({ ok: true, decoded });
    },
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
