import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from "dotenv";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";

dotenv.config();

const outlineChain = async (): Promise<LLMChain<string>> => {
    const outlinePromptTemplate = new PromptTemplate({
        inputVariables: ["title"],
        template: `あなたは脚本家です。劇のタイトルが与えられたら、そのタイトルの概要を書くのがあなたの仕事です。

        タイトル: {title}
        概要:`,
    });

    const model = new OpenAI();
    const chain = new LLMChain({ llm: model, prompt: outlinePromptTemplate });
    return chain;
};

const reviewChain = async (): Promise<LLMChain<string>> => {
    const reviewPromptTemplate = new PromptTemplate({
        inputVariables: ["outline"],
        template: `あなたはニューヨーク・タイムズの批評家です。劇のあらすじを聞いて、その劇の批評を書くのがあなたの仕事です。

        劇の概要: {outline}
        批評:`,
    });

    const model = new OpenAI();
    const chain = new LLMChain({ llm: model, prompt: reviewPromptTemplate });
    return chain;
};


export const run = async () => {
    const outline = await outlineChain();
    const review = await reviewChain();
    const chain = new SimpleSequentialChain({
        chains: [outline, review],
        verbose: true,
    });
    const res = await chain.run({ title: "ハムレット" });
    console.log(res);
};

run();
