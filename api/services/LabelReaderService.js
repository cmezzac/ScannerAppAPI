const { OpenAI } = require("openai");
const envApiKey = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({ apiKey: envApiKey });

async function readImageLabel(ocrText) {
  console.log("INSIDE THE LABEL READER:");
  console.log(ocrText);

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
You are a strict JSON generator.

Given the OCR text from a shipping label below, extract the recipient's name and full shipping address (not the sender), and return it ONLY as JSON like this:

{
  "name": "John Doe",
  "address": "123 Main Street, Apt 4B, New York, 10001, USA"
}

Do not add any explanation or extra text. Only return valid JSON.

OCR Text:
${ocrText}
            `.trim(),
          },
        ],
      },
    ],
  });

  const raw = response.choices[0].message.content;

  try {
    // Try to parse the content as JSON directly
    const json = JSON.parse(raw);
    return json;
  } catch (err) {
    // If parsing fails, log and return raw string
    console.warn("Could not parse JSON. Raw output:", raw);
    return raw;
  }
}

module.exports = { readImageLabel };
