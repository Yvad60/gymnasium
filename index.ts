import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const StateAnnotation = Annotation.Root({
  userMessage: Annotation<string>(),
  llmResponse: Annotation<string>(),
  tokenCount: Annotation<number>(),
});

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY ?? "",
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT ?? "",
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "",
});

const llmModel = async (state: typeof StateAnnotation.State) => {
  console.log("here is the user message", state.userMessage);
  const response = await model.invoke(state.userMessage);
  return { llmResponse: response.content as string };
};

const tokenCounter = (state: typeof StateAnnotation.State) => {
  console.log("here is the input", state.llmResponse);
  const count = state.llmResponse.split(" ").length;
  return { tokenCount: count };
};

const workflow = new StateGraph(StateAnnotation)
  .addNode("LLM_MODEL", llmModel)
  .addNode("TOKEN_COUNTER", tokenCounter)
  .addEdge(START, "LLM_MODEL")
  .addEdge("LLM_MODEL", "TOKEN_COUNTER")
  .addEdge("TOKEN_COUNTER", END);

export const compiledWorkflow = workflow.compile();
