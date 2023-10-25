import { z } from 'zod';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from 'langchain/schema/runnable';
import { PromptTemplate } from 'langchain/prompts';

// We can also construct an LLMChain from a ChatPromptTemplate and a chat model.

const llm = new OpenAI({
  temperature: 0.7,
  configuration: {
    baseURL: 'https://api.openai-sb.com/v1'
  },
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'sb-32201db676b8d99d0bc220a2ea26f4b001e8c44b3fdd96f5',
  streaming: true
});

const initPrompt = `You are an expert in Linux. Your job is to extract keywords from user input that may not be properly formatted. You need to extract two parts of information, ignoring any natural language content. Your output should not contain any natural language except for these two parts, and it cannot include any words.

1. Command
2. Overall command

For example, if the user input is "Please explain what 'find /path/ -name *.txt -type f' means." Your feedback should only consist of these two parts:

1. find
2. find /path/ -name *.txt -type f

{formatInstructions}

{userInput}`;

const rolePrompt = PromptTemplate.fromTemplate(initPrompt);
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    command: z
      .string()
      .describe('the command extract from input, which can be parsed by Linux Man page'),
    overallCommand: z
      .string()
      .describe('the overall command, which combined with command and params')
  })
);

const chain = RunnableSequence.from([rolePrompt, llm, parser]);

export const parseUserCommand = async (command) => {
  return await chain.invoke({
    userInput: command,
    formatInstructions: parser.getFormatInstructions()
  });
};
