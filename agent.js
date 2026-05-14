import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { createAgent, tool } from "langchain";
import * as z from "zod";

const addNumbers = tool((input) => input.number1 + input.number2, {
  name: "add_numbers",
  description: "Adds two numbers and returns the sum",
  schema: z.object({
    number1: z.number().describe("The first given number"),
    number2: z.number().describe("The second given number"),
  }),
});

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.OPENAI_API_KEY,
  azureOpenAIEndpoint: process.env.OPENAI_ENDPOINT,
  azureOpenAIApiDeploymentName: process.env.OPENAI_DEPLOYMENT,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
});

const agent = createAgent({
  model: model,
  tools: [addNumbers],
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the sum of 5 and 3?" }],
  }),
);
