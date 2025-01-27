require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { generateEmbedding } = require('./utils/generate_embeddings');
const { queryData } = require('./utils/query_data');
const { generateCompletion } = require('./utils/generate-complete');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

// Create an endpoint to interact with Pinecone
app.post('/api/query', async (req, res) => {
  const query = req.body.query;

  try {
    query_embedding = await generateEmbedding([query])
    matches = await queryData(query_embedding)
    const response = await generateCompletion(matches, query)

    console.log(response)
    res.json(response)
  } catch (error) {
    res.status(500).json({ message: 'Error querying Pinecone', error: error.stack });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
