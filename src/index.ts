import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as dotenv from "dotenv";

dotenv.config();

export const run = async () => {
    const loader = new GithubRepoLoader(
        "https://github.com/ikanago/dotfiles",
        {
            branch: "main",
            recursive: false,
            unknown: "warn"
        }
    );
    const docs = await loader.load();
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    const model = new OpenAI();
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const res = await chain.call({
        query: "What OS does this repo support?"
    });
    console.log(res);
};

run();
