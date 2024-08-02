import { GoogleGenerativeAI } from "@google/generative-ai";

const axios = require("axios");

const queryOpenAi = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    console.log("response.data.choices[0]", response.data.choices[0]);
    return response.data.choices[0].text;
  } catch (error) {
    console.error("Error querying OpenAI API: ", error);
    return null;
  }
};

const queryGemini = async (prompt) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    // Check for data property
    if (!result.response) {
      console.error("Missing data property in response");
      return null; // Or handle the error differently
    }

    // Check for candidates array (optional)
    const candidates = result.response.candidates || [result.response]; // Use default if missing

    // Check for content and parts (if applicable)
    const content = candidates[0]?.content;
    const parts = content?.parts;

    // Extract text if possible
    const text = parts?.[0]?.text;

    console.log("text", text);

    return text || ""; // Return empty string if text is missing
  } catch (error) {
    console.error("Error querying Gemini API: ", error);
  }
};

export { queryOpenAi, queryGemini, queryLLama };
