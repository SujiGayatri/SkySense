import groq from "./groq.js";
import { createPrompt } from "./prompt.js";

export async function askWeather(question, context) {
  const prompt = createPrompt(context, question);

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    // temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are an expert weather assistant. Give safe, practical recommendations.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}