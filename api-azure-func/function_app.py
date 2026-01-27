import os
import azure.functions as func  
import datetime
import json
import logging
import jwt
from jwt import PyJWKClient
app = func.FunctionApp()

AZURE_TENANT_ID = os.environ.get("AZURE_TENANT_ID")
AZURE_BACKEND_CLIENT_ID = os.environ.get("AZURE_BACKEND_CLIENT_ID")

JWKS_URL = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/discovery/v2.0/keys"

# Create JWKS client
jwks_client = PyJWKClient(JWKS_URL)

@app.route(route="hello", methods=["GET"])
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    auth_header = req.headers.get("Authorization")

    token = auth_header.split(" ")[1]
    signing_key = jwks_client.get_signing_key_from_jwt(token)

    decoded = jwt.decode(
      token,
      signing_key.key,
      algorithms=["RS256"],
      audience=AZURE_BACKEND_CLIENT_ID,
      issuer=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0"
    )

    logging.info(f"Token successfully verified: {decoded}")

    current_time = datetime.datetime.utcnow().isoformat() + "Z"
    response_data = {
        "message": "Hello, World!",
        "current_time": current_time
    }

    return func.HttpResponse(
        json.dumps(response_data),
        mimetype="application/json",
        status_code=200
    )
