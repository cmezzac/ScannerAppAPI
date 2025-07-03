const { OpenAI } = require("openai");
const envApiKey = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({ apiKey: envApiKey });

const nlp = require("compromise");

async function readImageLabell(ocrText) {
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

Given the OCR text from a shipping label below, extract the recipient's name and apprtment number of the receiver. The appartment number is 
typically found after the street adress so look for it there , and return it ONLY as JSON like this:

{
  "name": "John Doe",
  "appartment": "402"
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

async function readImageLabel(ocrText) {
  console.log("INSIDE THE LABEL READER:");
  console.log(ocrText);

  const lines = ocrText.split(/\r?\n/).map((line) => line.trim());

  for (const line of lines) {
    if (/^[A-Z\s]{5,}$/.test(line) && line.split(" ").length >= 2) {
      return { name: toTitleCase(line) };
    }
  }

  return { name: null };
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

module.exports = { readImageLabel };
