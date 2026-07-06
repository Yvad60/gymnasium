import { AzureChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LLMService {
  readonly LLMChatClient: AzureChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    const azureOpenAIApiKey = this.configService.get(
      'AZURE_OPENAI_API_KEY',
    ) as string;
    const azureOpenAIEndpoint = this.configService.get(
      'AZURE_OPENAI_ENDPOINT',
    ) as string;
    const azureOpenAIApiVersion = this.configService.get(
      'AZURE_OPENAI_API_VERSION',
    ) as string;
    const azureOpenAIApiDeploymentName = this.configService.get(
      'AZURE_OPENAI_DEPLOYMENT',
    ) as string;

    this.LLMChatClient = new AzureChatOpenAI({
      azureOpenAIApiKey,
      azureOpenAIEndpoint,
      azureOpenAIApiVersion,
      azureOpenAIApiDeploymentName,
    });
  }
}
