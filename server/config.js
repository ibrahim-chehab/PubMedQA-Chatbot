const OpenAI = require("openai");
const { Pinecone } = require('@pinecone-database/pinecone');

// OpenAI config
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Pinecone setup on the server
const pinecone = new Pinecone({
  apiKey: process.env.VITE_PINECONE_API_KEY,
});

const index = pinecone.index("llm-assignment");

module.exports = {
  openai,
  pinecone,
  index
}
