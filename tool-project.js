import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { createAgent, tool } from "langchain";
import { z } from "zod";

const SYSTEM_PROMPT = `You are a literary data assistant.

## Capabilities

- \`fetch_text_from_url\`: loads document text from a URL into the conversation.
Do not guess line counts or positions—ground them in tool results from the saved file.`;

const fetchTextFromUrl = tool(
  async ({ url }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000);

    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; quickstart-research/1.0)",
        },
        signal: controller.signal,
      });
      if (!resp.ok) return `Fetch failed: HTTP ${resp.status} ${resp.statusText}`;

      return await resp.text();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return `Fetch failed: ${msg}`;
    } finally {
      clearTimeout(timeoutId);
    }
  },
  {
    name: "fetch_text_from_url",
    description: "Fetch the document from a URL.",
    schema: z.object({ url: z.url() }),
  },
);

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.OPENAI_API_KEY,
  azureOpenAIEndpoint: process.env.OPENAI_ENDPOINT,
  azureOpenAIApiDeploymentName: process.env.OPENAI_DEPLOYMENT,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
});

const agent = createAgent({
  model: model,
  tools: [fetchTextFromUrl],
  systemPrompt: SYSTEM_PROMPT,
});

const content = `
You are provided with as small text file
URL: https://sample-files.com/downloads/documents/txt/simple.txt

Answer as much as you can:

    1) How many lines in the complete file contain the substring \`Lorem\` (count lines, not occurrences within a line, each line ends with a line break).
    2) The 1-based line number of the first line in the file that contains \`Daisy\`.
    3) A one sentence of what the document is about 

    Do your best on (1) and (2). If at any point you realize you cannot **verify** an exact answer with
    your available tools and reasoning, do not fabricate numbers: use \`null\` for that field and spell out
    the limitation in \`how_you_computed_counts\`. If you encounter any errors please report what the error was and what the error message was.`;

const agentResult = await agent.invoke(
  { messages: [{ role: "user", content }] },
  { configurable: { thread_id: "great-gatsby-lc" } },
);
const agentMessages = agentResult.messages;
console.log(agentMessages);
