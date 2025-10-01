const apiKey = "AIzaSyCSAzKIf0hJj9StdQxdZQgjHsdJOkCwVaI";
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  apiKey;

// Generic Gemini call function
export default async function callGemini(prompt) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Gemini API error");
  return response.json();
}

// Usage in your parseJobInfo function
