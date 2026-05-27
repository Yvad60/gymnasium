import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import model from "./model.js";

const multiplyTool = (number1: number, number2: number) => {
  return number1 * number2;
};

const llmWithTool = model.bindTools([multiplyTool]);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("tool_powered_llm", llmWithTool)
  .addEdge(START, "tool_powered_llm")
  .addEdge("tool_powered_llm", END);

export const graph = workflow.compile();
