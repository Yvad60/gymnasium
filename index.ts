import { END, Graph, START } from "@langchain/langgraph";
import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const tokenCounter = (input: string) => {
  console.log("here is the input", input);
  return input.split(" ").length;
};
const workflow = new Graph();

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY ?? "",
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT ?? "",
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "",
});

const llmModel = async (userMessage: string) => {
  console.log("here is the user message", userMessage);
  const response = await model.invoke(userMessage);
  return response.content;
};

workflow
  .addNode("LLM_MODEL", llmModel)
  .addNode("TOKEN_COUNTER", tokenCounter)
  .addEdge(START, "LLM_MODEL")
  .addEdge("LLM_MODEL", "TOKEN_COUNTER")
  .addEdge("TOKEN_COUNTER", END);

const compiledWorkflow = workflow.compile();

const response = await compiledWorkflow.invoke("Hello there");

console.log(response);
