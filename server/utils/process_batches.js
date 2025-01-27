// Import necessary libraries
const { index } = require('../config');
const { generateEmbedding } = require('./generate_embeddings');

// Function to get metadata for each item
function getMetadata(item) {
  return {
    question: item.question,
    answer: item.answer,
    chunk: item.chunk,
    final_decision: item.final_decision,
    labels: item.labels,
    meshes: item.meshes,
  };
}

// Function to process and upsert batches of data
export async function processBatches(allChunkedData, index, BATCH_SIZE = 1280) {
  try {
    // Get current vector count and total vector count
    const currentVectorCount = await index.describeStats();
    const totalVectorCount = currentVectorCount.total_vector_count;
    console.log("Total vector count:", totalVectorCount);

    const stopIndex = 128 * 10; // Define the stop index (adjust as necessary)
    const batchNumber = Math.round((stopIndex / BATCH_SIZE) + 0.4);

    for (let i = 0; i < stopIndex; i += BATCH_SIZE) {
      const j = i + totalVectorCount + 100000;
      console.log(`Processing batch ${(i / BATCH_SIZE) + 1}/${batchNumber}`);

      const batch = allChunkedData.slice(j, j + BATCH_SIZE);
      console.log(`Batch size: ${batch.length}`);

      if (batch.length === 0) {
        console.log("Empty batch, skipping...");
        continue;
      }

      const chunks = batch.map(item => item.chunk);
      const metadata = batch.map(item => getMetadata(item));

      // Generate embeddings for the chunks
      const vectors = await generateEmbedding(chunks);
      console.log(`Generated ${vectors.length} vectors for ${chunks.length} chunks`);

      if (vectors.length !== chunks.length) {
        console.log("Mismatch in chunks and vectors, skipping batch...");
        continue;
      }

      // Prepare entries for upsert
      const entries = metadata.map((m, index) => ({
        id: nextId(), // Assuming nextId is defined elsewhere
        vector: vectors[index],
        metadata: m,
      }));

      console.log(`Upserting ${entries.length} entries to Pinecone...`);
      const response = await index.upsert(entries);
      console.log("Upsert response:", response);
    }
  } catch (error) {
    console.error("Error processing batches:", error);
  }
}

// Example usage: Assuming you have `allChunkedData` and `index` from Pinecone initialized
// processBatches(allChunkedData, index).then(() => {
//   console.log("Batch processing complete.");
// }).catch((error) => {
//   console.error("Error in batch processing:", error);
// });
