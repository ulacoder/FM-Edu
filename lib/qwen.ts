import OpenAI from 'openai';

export const qwenClient = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.QWEN_BASE_URL,
});

export async function qwenChat(messages: Array<{ role: string; content: string }>) {
  try {
    // @ts-ignore - Qwen API uses extra_body which is not in OpenAI types
    const completion = await qwenClient.chat.completions.create({
      model: "qwen3.5-flash",
      messages: messages as any,
      extra_body: { enable_thinking: true },
      stream: false,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Qwen API error:", error);
    throw error;
  }
}

export async function qwenChatStream(messages: Array<{ role: string; content: string }>) {
  try {
    // @ts-ignore - Qwen API uses extra_body which is not in OpenAI types
    const completion = await qwenClient.chat.completions.create({
      model: "qwen3.5-flash",
      messages: messages as any,
      extra_body: { enable_thinking: true },
      stream: true,
    });

    return completion;
  } catch (error) {
    console.error("Qwen API stream error:", error);
    throw error;
  }
}
