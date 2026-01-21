// ⚠️ SECURITY WARNING: This key is hardcoded for ease of use.
// In a production app, use environment variables (import.meta.env.VITE_COHERE_API_KEY).
const COHERE_API_KEY = 'N2mvsti4PTxo1MWiPAySpIJVk1oTKTLJ3CGfzFZN';

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
