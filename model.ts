import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY ?? "",
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT ?? "",
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "",
});

export default model;
