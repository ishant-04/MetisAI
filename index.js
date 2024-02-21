import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";

import express from "express";
import multer from "multer";
import { OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


import { Tiktoken } from "@dqbd/tiktoken/lite";
import { load } from "@dqbd/tiktoken/load";
import registry from "@dqbd/tiktoken/registry.json" assert { type: "json" };
import models from "@dqbd/tiktoken/model_to_encoding.json" assert { type: "json" };

// 4. Import dotenv for loading environment variables and fs for file system operations
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 3. Initialize the multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './documents/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// ...

const upload = multer({ storage: storage })

app.post('/upload', upload.array('files', 5), (req, res) => {
  res.status(200).send('Files uploaded and stored in documents folder');
});

// 5. Initialize the document loader with supported file formats
const loader = new DirectoryLoader("./documents", {
    ".json": (path) => new JSONLoader(path),
    ".txt": (path) => new TextLoader(path),
  });
  

// 6. Load documents from the specified directory
console.log("Loading docs...");
const docs = await loader.load();
console.log("Docs loaded.");

// 7. function to calculate the cost of tokenizing the documents
async function calculateCost() {
  const modelName = "text-embedding-ada-002";
  const modelKey = models[modelName];
  const model = await load(registry[modelKey]);
  const encoder = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  );
  const tokens = encoder.encode(JSON.stringify(docs));
  const tokenCount = tokens.length;
  const ratePerThousandTokens = 0.0004;
  const cost = (tokenCount / 1000) * ratePerThousandTokens;
  encoder.free();
  return cost;
}

const VECTOR_STORE_PATH = "Documents.index";
// const question = "Tell me about these docs";

// 8. Define a function to normalize the content of the documents
function normalizeDocuments(docs) {
  return docs.map((doc) => {
    if (typeof doc.pageContent === "string") {
      return doc.pageContent;
    } else if (Array.isArray(doc.pageContent)) {
      return doc.pageContent.join("\n");
    }
  });
}

// 9. Define the main function to run the entire process
export const run = async () => {
  // 10. Calculate the cost of tokenizing the documents
  console.log("Calculating cost...");
  const cost = await calculateCost();
  console.log("Cost calculated:", cost);

  // 11. Check if the cost is within the acceptable limit
  if (cost <= 1) {
    // 12. Initialize the OpenAI language model
    const model = new OpenAI({});

    let vectorStore;

    // 13. Check if an existing vector store is available
    console.log("Checking for existing vector store...");
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      // 14. Load the existing vector store
      console.log("Loading existing vector store...");
      vectorStore = await HNSWLib.load(
        VECTOR_STORE_PATH,
        new OpenAIEmbeddings()
      );
      console.log("Vector store loaded.");
    } else {
      // 15. Create a new vector store if one does not exist
      console.log("Creating new vector store...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const normalizedDocs = normalizeDocuments(docs);
      const splitDocs = await textSplitter.createDocuments(normalizedDocs);

      // 16. Generate the vector store from the documents
      vectorStore = await HNSWLib.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings()
      );
      // 17. Save the vector store to the specified path
      await vectorStore.save(VECTOR_STORE_PATH);

      console.log("Vector store created.");
    }

    // 18. Create a retrieval chain using the language model and vector store
    console.log("Creating retrieval chain...");
    global.chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  } else {
    // 20. If the cost exceeds the limit, skip the embedding process
    console.log("The cost of embedding exceeds $1. Skipping embeddings.");
  }
};

run();

// 19. Query the retrieval chain with the specified question
app.post("/chat", async (req, res) => {
    console.log("Querying chain...");
    const question = req.headers.question;
    const answer = await chain.call({ query: question });
    console.log({ answer });
    if(answer){
      res.json({message: answer});
    }  
});

// 21. Run the main function
// run();


