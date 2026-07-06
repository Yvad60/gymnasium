import { Module } from '@nestjs/common';
import { LLMModule } from '../llm/llm.module';
import { AgentService } from './agent.service';

@Module({
  imports: [LLMModule],
  providers: [AgentService],
})
export class AgentModule {}
