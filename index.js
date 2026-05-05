import "dotenv/config";
import { AzureOpenAI } from "openai";

const client = new AzureOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  endpoint: process.env.OPENAI_ENDPOINT,
  apiVersion: process.env.OPENAI_API_VERSION,
  deployment: process.env.OPENAI_DEPLOYMENT,
});

/* 
  We can get AI to consider the conversation history by manually sending previous conversation in the same request. 
  We alternate "user" and "assistant" roles to specify messages sent by user and the model
*/
async function manuallyConstructConversation() {
  const response = await client.responses.create({
    model: process.env.OPENAI_DEPLOYMENT,
    input: [
      {
        role: "user",
        content: "What is the capital of France?",
      },
      {
        role: "assistant",
        content: "The capital of France is Kigali",
      },
      {
        role: "user",
        content: "Incorrect, what's wrong with you?",
      },
    ],
  });

  console.log(response.output_text);
}

// await manuallyConstructConversation();

async function useResponseApi() {
  let history = [
    {
      role: "user",
      content: "tell me a joke",
    },
  ];

  const response = await client.responses.create({
    model: process.env.OPENAI_DEPLOYMENT,
    input: history,
  });

  console.log(response.output_text);

  history = [
    ...history,
    ...response.output.map((el) => {
      return el;
    }),
  ];

  history.push({
    role: "user",
    content: "why is that funny?",
  });

  const response2 = await client.responses.create({
    model: process.env.OPENAI_DEPLOYMENT,
    input: history,
  });

  console.log(response2.output_text);
}

// await useResponseApi();

async function automaticHandleWithApi() {
  const response = await client.responses.create({
    model: process.env.OPENAI_DEPLOYMENT,
    input: [
      {
        role: "user",
        content: "Who is michael jackson?",
      },
    ],
  });

  console.log(response.output_text);

  const response2 = await client.responses.create({
    model: process.env.OPENAI_DEPLOYMENT,
    input: [
      {
        role: "user",
        content: "Which mental issues did he have?",
      },
    ],
  });

  console.log(response2.output_text);
}

await automaticHandleWithApi();
