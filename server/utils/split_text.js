const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// LangChain text splitter
export async function splitText(document) {
  const response = await fetch(document);
  const text = await response.text();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const output = await splitter.createDocuments([text]);
  return output;
}