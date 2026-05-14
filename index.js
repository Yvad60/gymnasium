import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.OPENAI_API_KEY,
  azureOpenAIEndpoint: process.env.OPENAI_ENDPOINT,
  azureOpenAIApiDeploymentName: process.env.OPENAI_DEPLOYMENT,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
});

async function main() {
  const response = await model.invoke(
    await ChatPromptTemplate.fromTemplate("What is the capital of {country}?").format({
      country: "France",
    }),
  );
  console.log(response.content);
}

await main();
