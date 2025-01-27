const { index } = require("../config");

async function queryData(queryVector) {
  const query_response = await index.query({
    vector: queryVector,
    topK: 3,
    includeValues: false,
    includeMetadata: true
  });

  const matches = query_response.matches
  const combined_matches = matches.map(match => match.metadata['question'] + ' ' + match.metadata['answer']).join('\n')
  return combined_matches
}

module.exports = {
  queryData
}