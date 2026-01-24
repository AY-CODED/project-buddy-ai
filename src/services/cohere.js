const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

export const generateWithCohere = async (title, description) => {
  const url = 'https://api.cohere.ai/v1/chat';

  // ✅ UPDATED PROMPT: STRICT "NO MARKDOWN" RULES
  const prompt = `
  You are a university student submitting an assignment.
  Topic: "${title}"
  Details: "${description}"

  Instructions:
  1. Write a high-quality, formal academic response suitable for a lecturer to grade.
  2. **CRITICAL:** Do NOT use Markdown symbols (like #, *, -, or >).
  3. Do NOT use bolding or italics syntax.
  4. Write in clear paragraphs. Use standard spacing to separate sections.
  5. If listing items, use numbers (1., 2.) or letters (a., b.) followed by a period, not dashes or dots.
  6. Make it look like a standard typed essay or report.

  Start writing the assignment immediately.
  `;

  try {
    if (!COHERE_API_KEY) {
        throw new Error('Cohere API Key is missing. Please check your .env file.');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Client-Name': 'ReactApp'
      },
      body: JSON.stringify({
        message: prompt,
        model: "command-a-03-2025",
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Cohere API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (err) {
    console.error("Cohere Service Error:", err);
    throw err;
  }
};

export const chatWithCohere = async (currentDocContent, chatHistory, userMessage) => {
  const url = 'https://api.cohere.ai/v1/chat';

  // Map our internal chat history to Cohere's format
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'USER' : 'CHATBOT',
    message: msg.message
  }));

  const preamble = `
You are a helpful academic writing assistant.
You are currently helping a student with a document.
The current content of the document is provided below.
Use this content to answer the user's questions or help them rewrite sections.
Do not use Markdown formatting in your responses unless explicitly asked.
Keep responses concise and helpful.

DOCUMENT CONTENT:
"""
${currentDocContent || "(No content yet)"}
"""
  `;

  try {
    if (!COHERE_API_KEY) {
        throw new Error('Cohere API Key is missing. Please check your .env file.');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Client-Name': 'ReactApp'
      },
      body: JSON.stringify({
        message: userMessage,
        chat_history: formattedHistory,
        preamble: preamble,
        model: "command-r-08-2024",
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Cohere API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (err) {
    console.error("Cohere Chat Error:", err);
    throw err;
  }
};
