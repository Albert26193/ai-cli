import { ChatPromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { parseUserCommand } from './UserCommandParser';

import { exec } from 'child_process';

// We can also construct an LLMChain from a ChatPromptTemplate and a chat model.

const CHAT_INIT_PROMPT = `请注意，你是一个Linux领域的专家。我会请教你一些和命令有关的问题，我的主要目的是为了学习*命令的参数*.如果我为你提供了man手册相关内容,请你*在范围内查找*,而不是自由发散如果我为你提供了man手册相关内容,请你*在范围内查找*,而不是自由发散.

请你按照如下格式回答问题:
[[命令全称]] [[命令简介]] [[参数全称和含义]] [[简单的示例]] [[其他可选参数]]
其中, [[命令简介]]部分尽量简短,用5-10个字左右描述. 此外, [[命令参数全称和含义]], 这部分的功能应该尽量详细,它是我希望学习的重点.
譬如,我的输入是ls -a, 你的回答应该是: 

[[命令全称]]: ls ==> list
[[命令简介]]: 用来打印指定目录 [[参数全称和含义]]: -a ==> a: all, 表示输出全部的内容
[[简单的示例]]: ls -a /path/some-dir ==> 输出/path/some-dir 目录下的全部内容 
[[其他可选参数]]: 列出该命令的其他可选参数(参数条目越多越好,因为我的目的是为了学习多种不同的参数的含义).
如:
- l: long format，以长格式显示文件信息 
- a: all，显示所有文件，包括隐藏文件 
- h: human-readable，以易读的格式显示文件大小.

综上所述, 你的解答应该如同上面的格式,再次重申,我的目的是为了学习*命令的参数*,如果我给你的参数不存在,你应该明确指出该参数错误.
此外,你的解答使用中文,请严格按照上面规定的格式以及符号作答.
不要输出 man 手册的内容"
`;

const chat = new ChatOpenAI({
  temperature: 0.7,
  configuration: {
    baseURL: 'https://api.openai-sb.com/v1'
  },
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'sb-32201db676b8d99d0bc220a2ea26f4b001e8c44b3fdd96f5',
  streaming: true
});

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful assistant that tell me about Linux/Unix Command {commandToQuery}. Your template is ${CHAT_INIT_PROMPT}, what is more, i will offer you man output from man page, you should search within the man page, but DO Not output man page. output language is Chinese.`
  ],
  ['human', '{commandToQuery}, {overallCommand} and {manOutput}']
]);

const chain = new LLMChain({
  prompt: chatPrompt,
  llm: chat
});

const commandJson = await parseUserCommand('请告诉我 xargs -I 是什么意思');

console.log(commandJson);

const commandToQuery = commandJson.command;
const overallCommand = commandJson.overallCommand;

const manCommand = `man ${commandToQuery}`;
let manOutput = '';

exec(manCommand, (error, stdout, stderr) => {
  if (error) {
    // console.error(`执行 man 命令时出错: ${error.message}`);
    return;
  }
  if (stderr) {
    // console.error(`man 命令返回错误: ${stderr}`);
    return;
  }

  manOutput = stdout;

  // 解析 man 命令的输出（stdout）并在需要时使用
  // console.log(`man 命令的输出：\n${manOutput}`);

  // 在这里可以将 man 命令的输出与聊天模型的输出结合起来以满足你的需求。
});

const res = await chain.call(
  {
    commandToQuery: commandToQuery,
    overallCommand: overallCommand,
    manOutput: manOutput
  },
  [
    {
      handleLLMNewToken(token) {
        process.stdout.write(token);
      }
    }
  ]
);

process.stdout.write('\n');
