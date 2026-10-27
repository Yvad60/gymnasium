import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const client = new Client({
  name: "learning-calculator-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "pnpx",
  args: ["tsx", "src/index.ts"],
});

async function main() {
  try {
    // Connect and initialize the MCP session
    await client.connect(transport);
    console.log("Connected to calculator server.");

    // Discover the server's tools
    const { tools } = await client.listTools();

    console.log("\nAvailable tools:");
    for (const tool of tools) {
      console.log(`- ${tool.name}: ${tool.description}`);
    }

    // Call the add tool
    const result = await client.callTool({
      name: "add",
      arguments: { a: 12, b: 8 },
    });

    console.log("\nAddition result:");
    for (const block of result.content) {
      if (block.type === "text") {
        console.log(block.text);
      }
    }
  } finally {
    // Close the connection and stop the child process
    await client.close();
  }
}

main().catch((error) => {
  console.error("Client failed:", error);
  process.exitCode = 1;
});
