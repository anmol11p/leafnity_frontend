import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API });

const aiResponse = async (prompt, data) => {
  try {
    const chatPrompt = `
    You are an AI chatbot for Leafnity, a gardening e-commerce website similar to Ugaoo.
    
    Here is some important customer data you can use:
    ${JSON.stringify(data, null, 2)}

    - Use this data to answer customer queries.
    - If the customer asks about an **order, cart, or product**, find relevant details from the provided data.
    - If you don't find the requested information, politely ask the user to provide more details.
    - Keep answers **clear, short, and user-friendly**.

    Now, respond to this customer question:
    User: ${prompt}
    AI:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Response Error:", error);
    return "An error occurred while generating the response.";
  }
};

const errorMessages = [
  "Oops! Looks like you forgot to ask something. 🤔",
  "Please enter your question before submitting! 😊",
  "We're here to help! Type your question and try again. 💬",
  "Your question cannot be empty. Please ask something!",
  "Don't be shy! Ask your question, and I'll help you. 🌿",
  "Hey there! Got a query? Type it below and hit submit. 🚀",
  "I’m all ears! Ask me anything about plants & gardening. 🌱",
];
export { aiResponse, errorMessages };
