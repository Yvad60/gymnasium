export class MomoService {
  private static config = {
    baseURL: "https://momodeveloper.mtn.com",
    sandboxURL: "https://sandbox.momodeveloper.mtn.com",
    targetEnvironment: "sandbox",
    apiKey: "e4639e266f3d4ecdbc134158553b4244",
    subscriptionKey: "6dfecab526eb4787bd308505390b15c0",
    apiUser: "f1274f7a-56c9-4d31-87bc-479cdb238f2f",
  };

  static async getAccessToken(): Promise<string> {
    try {
      const basicAuth = btoa(`${this.config.apiUser}:${this.config.apiKey}`);
      const apiHost =
        this.config.targetEnvironment === "production"
          ? this.config.baseURL
          : this.config.sandboxURL;

      const response = await fetch(`${apiHost}/collection/token/`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Ocp-Apim-Subscription-Key": this.config.subscriptionKey,
        },
      });

      const responseText = await response.text();
      console.log("Token response status:", response.status);
      console.log("Token response body:", responseText.substring(0, 200));

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} - ${responseText}`);
      }

      const data = this.parseJsonResponse(responseText);
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 min early

      return this.accessToken || "";
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  }
}
