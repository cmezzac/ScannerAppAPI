const { OpenAI } = require("openai");
const envApiKey = process.env.OPEN_AI_API_KEY;
const openai = new OpenAI({
  apiKey: envApiKey,
});

async function readImageLabel() {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here is an image of a shipping label, return me a JSON with the variables, name, appartment. Extract that information from the shipping label",
          },
          {
            type: "image_url",
            image_url: {
              url: "https://craftmypdf.com/wp-content/uploads/2024/10/shipping_label_02.png",
            },
          },
        ],
      },
    ],
  });
  return response.choices[0].message;
}

module.exports = { readImageLabel };
