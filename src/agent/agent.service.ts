import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { Injectable } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';

const buildAgent = (llm: LLMService['LLMChatClient']) => {
  const callLLM = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: [response] };
  };

  return new StateGraph(MessagesAnnotation)
    .addNode('LLM', callLLM)
    .addEdge(START, 'LLM')
    .addEdge('LLM', END)
    .compile();
};

type Agent = ReturnType<typeof buildAgent>;

@Injectable()
export class AgentService {
  private readonly agent: Agent;

  constructor(private readonly llmService: LLMService) {
    this.agent = buildAgent(this.llmService.LLMChatClient);
  }
}
