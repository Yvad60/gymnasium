import { SystemMessage } from "@langchain/core/messages";
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import type { ChatOpenAICallOptions } from "@langchain/openai";
import { tool } from "langchain";
import { z } from "zod/v4";
import model from "./model.js";

const multiplyTool = tool(
  ({ number1, number2 }) => {
    return number1 * number2;
  },
  {
    name: "multiply_numbers",
    description: "Multiply two numbers and return the product",
    schema: z.object({
      number1: z.number(),
      number2: z.number(),
    }),
  },
);
const toolsNode = new ToolNode([multiplyTool]);

const llmWithTool = model.bindTools([multiplyTool]);

const toolPoweredLlm = async (state: typeof MessagesAnnotation.State) => {
  const config: ChatOpenAICallOptions = {
    configurable: {
      thread_id: "abcd",
    },
  };
  const response = await llmWithTool.invoke(
    [
      new SystemMessage(
        "You are helpful assistant that help with multiplication using available tool, always use the tool for multiplication ",
      ),
      ...state.messages,
    ],
    config,
  );
  return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("tool_powered_llm", toolPoweredLlm)
  .addNode("tools", toolsNode)
  .addEdge(START, "tool_powered_llm")
  .addConditionalEdges("tool_powered_llm", toolsCondition)
  .addEdge("tools", "tool_powered_llm")
  .addEdge("tool_powered_llm", END);

const memory = new MemorySaver();

export const graph = workflow.compile({ checkpointer: memory });
