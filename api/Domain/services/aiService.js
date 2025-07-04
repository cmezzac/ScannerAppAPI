const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

async function readShippingLabelWithOpenAI(base64Image) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
                You will be given an image of a shipping label.

                Extract the following:
                - Name (the recipient's full name)
                - TrackingNumber (the tracking number from the label)
                - Courier (e.g., UPS, FedEx, DHL, Canada Post, Purolator, etc.)

                Return the result as a **valid JSON object** using this exact format:
                {
                "Name": "string",
                "TrackingNumber": "string",
                "Courier": "string"
                }

                If any value is missing, return it as null.
                `.trim(),
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  const usage = response.usage;

  console.log("Token Usage:", usage);

  return response.choices[0].message.content;
}

module.exports = {
  readShippingLabelWithOpenAI,
};
