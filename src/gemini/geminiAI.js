import axios from "axios";

const aiResponse = async (prompt, data) => {
  try {
    const chatPrompt = `
    You are an AI chatbot for Leafnity, a gardening e-commerce website similar to Ugaoo.
    
    Here is some important customer data you can use:
    ${JSON.stringify(data, null, 2)}

     🟢 RULES FOR RESPONSES:
    - Always reply in **short, clear sentences**.
    - Summarize multiple items using bullet points or line breaks.
    - Never include extra details like order IDs, internal codes, or too much text.
    - Show only the **product name, date, and price** — not full addresses or redundant "status: Ordered" info.
    - Respond like a human customer support agent, not a system log.
    - Do NOT use markdown (**bold**, *italic*, asterisks, etc.) — plain text only.

   Example style:
    "You’ve ordered:
     - Snake Plant on July 23, 2025 – ₹902.5
     - Aloe Vera on July 2, 2025 – ₹475
     The May 2, 2025 order was refunded."
     
    Now, respond to this customer question:
    User: ${prompt}
    AI:
    `;

    const api = "https://repromitra-backend.onrender.com";
    const response = await axios.post(`${api}/gemini`, {
      prompt,
      chatBoatName: chatPrompt,
    });
    if (response.status === 200) {
      const cleaned = response.data.message
        .replace(/\*\*/g, "") // remove bold markdown
        .replace(/^\*\s*/gm, "") // remove list bullets
        .replace(/[-_]{2,}/g, ""); // remove extra dashes or underscores

      return cleaned.trim();
    }
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
