import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

// 1. Create the MCP server
const server = new McpServer({
  name: "learning-calculator",
  version: "1.0.0",
});

// 2. Register an addition tool
server.registerTool(
  "add",
  {
    description: "Add two numbers together",
    inputSchema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a + b),
      },
    ],
  }),
);

// 3. Register a multiplication tool
server.registerTool(
  "multiply",
  {
    description: "Multiply two numbers together",
    inputSchema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a * b),
      },
    ],
  }),
);

server.registerTool(
  "subtraction",
  {
    description: "Subtract two a number from the other",
    inputSchema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a - b),
      },
    ],
  }),
);

// 4. Start the server over stdio
void serveStdio(() => server);

console.error("Learning Calculator MCP server started");
