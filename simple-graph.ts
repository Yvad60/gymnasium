import { END, START, StateGraph, StateSchema, type ExtractStateType } from "@langchain/langgraph";
import { z } from "zod/v4";

const state = new StateSchema({
  graphState: z.string(),
});

type StateType = ExtractStateType<typeof state>;

const node1 = (input: StateType): StateType => {
  console.log("here is the input", input.graphState);
  return { graphState: `${input.graphState} I am` };
};

const node2 = (input: StateType): StateType => {
  console.log("here is the input", input.graphState);
  return { graphState: `${input.graphState} Happy!` };
};

const node3 = (input: StateType): StateType => {
  console.log("here is the input", input.graphState);
  return { graphState: `${input.graphState} Sad!` };
};

const decideMood = (input: StateType) => {
  console.log("here is the input", input.graphState);
  const randomNumber = Math.random();

  if (randomNumber > 0.5) return "node_2";
  return "node_3";
};

const workflow = new StateGraph(state);

export const compiledWorkflow = workflow
  .addNode("node_1", node1)
  .addNode("node_2", node2)
  .addNode("node_3", node3)
  .addEdge(START, "node_1")
  .addConditionalEdges("node_1", decideMood, ["node_2", "node_3"])
  .addEdge("node_2", END)
  .addEdge("node_3", END)
  .compile();
