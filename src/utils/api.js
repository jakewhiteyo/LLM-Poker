const axios = require("axios");

const queryApi = async (prompt, model) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/query-llm",
      {
        prompt: prompt,
        model: model,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`API query failed: `, error);
  }
};
export { queryApi };
