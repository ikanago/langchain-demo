import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from "dotenv";
import { LLMChain } from "langchain/chains";

dotenv.config();

export const run = async () => {
    const prompt = new PromptTemplate({
        inputVariables: ["product"],
        template: "カラフルな{product}を作る会社の良い名前を考えてください。",
    });

    const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    const chain = new LLMChain({ llm: model, prompt });
    const res = await chain.call({ product: "ハンバーガー" });
    console.log(res)
};

run();
