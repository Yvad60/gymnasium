import { AzureChatOpenAI } from "@langchain/openai";
import { tavily } from "@tavily/core";
import "dotenv/config";
import { createAgent, HumanMessage, tool } from "langchain";

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY ?? "",
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "",
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT ?? "",
});

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY ?? "",
});

async function webSearch(query: string) {
  const response = await tvly.search(query);
  return response.results;
}

const webSearchTool = tool(webSearch, {
  name: "web-search",
  description: "A tool for searching the web for information.",
  schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query.",
      },
    },
    required: ["query"],
  },
});

const agent = createAgent({
  model,
  systemPrompt: `You are a skillful chef who can create creative and delicious recipes based on leftover ingredients provided by the user. Your goal is to help the user create a meal that is both tasty and satisfying.
      You have access to the web search tool that allows you to search the internet, 
      When the user provides a list of leftover ingredients, you will search the internet for inspiration and suggestions.
      You will then use the information you found to create a recipe that incorporates the leftover ingredients in a delicious way.
      When the user does not provide any leftover ingredients or ask about anything else, you will ask them to provide a list of ingredients they have on hand.
    `,
  tools: [webSearchTool],
});

const response = await agent.invoke({
  messages: [
    new HumanMessage(
      "I have some leftover chicken, rice, and broccoli. What can I make for dinner?",
    ),
  ],
});

console.log(response.messages.at(-1)?.content);
