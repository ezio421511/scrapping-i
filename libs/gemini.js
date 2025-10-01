const apiKey = "AIzaSyCSAzKIf0hJj9StdQxdZQgjHsdJOkCwVaI";
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  apiKey;

// Generic Gemini call function
export default async function callGemini(prompt) {
  console.log("Calling Gemini API...", prompt);
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
  const data = await response.json();

  // Assuming the response structure is something like:
  // { "id": "...", "contents": [{ "text": "..." }] }
  // Adjust the path if your API returns differently

  //todo : add quote usage log features here!

  const rawdata = data.candidates?.[0]?.content.parts?.[0].text ?? "";
  return rawdata
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
}

// Usage in your parseJobInfo function
