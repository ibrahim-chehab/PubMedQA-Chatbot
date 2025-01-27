const { openai } = require("../config")

const dataset_name = "PubMedQA"
const assistant_name = "Medical Assistant"
const response_style = "clear, concise, and accurate"

const system_message = `
You are a knowledgeable assistant, ${assistant_name}, providing answers to medical questions based on the ${dataset_name} dataset.
When answering, ensure to use relevant information from medical research and literature, and base your responses on the provided context or previously shared answers.
If you're unsure about the answer, reply with, "Sorry, I don't know the answer."
Always aim to provide ${response_style} information. Avoid making up medical details or providing unsupported claims.
`

async function generateCompletion(text, query) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { "role": "system", "content": system_message },
      { "role": "user", "content": `Context: ${text} Question: ${query}` }
    ]
  })
  // console.log(response)
  return response.choices[0].message.content
}

module.exports = {
  generateCompletion
}