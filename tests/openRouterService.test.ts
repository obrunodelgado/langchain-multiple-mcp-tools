import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AIMessage, type BaseMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod/v3';
import { OpenRouterService } from '../src/services/openRouterService.ts';
import { config } from '../src/config.ts';

class BatchModel extends BaseChatModel {
    _llmType() { return 'batch-regression-test'; }
    bindTools() { return this; }
    async _generate(messages: BaseMessage[]) {
        const completed = messages.filter(message => message.type === 'tool').length;
        const message = completed < 15
            ? new AIMessage({ content: '', tool_calls: [{ name: 'batch', args: {}, id: `batch-${completed}` }] })
            : new AIMessage('All batches completed');
        return { generations: [{ text: message.text, message }] };
    }
}

test('agent completes a finite workflow requiring more than 25 graph steps', async () => {
    const service = new OpenRouterService({ ...config, apiKey: 'test-only' });
    let completed = 0;
    // Replace external dependencies: this test never calls OpenRouter or MongoDB.
    Object.assign(service, {
        llmClient: new BatchModel({}),
        tools: [tool(async () => { completed++; return 'Batch inserted'; }, {
            name: 'batch', description: 'Process one batch', schema: z.object({}),
        })],
    });
    const result = await service.generateStructured('Process all batches', 'Start');
    assert.equal(completed, 15);
    assert.equal(result.data, 'All batches completed');
});
