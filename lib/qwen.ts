import OpenAI from 'openai';

export const qwenClient = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
});

export async function qwenChat(messages: Array<{ role: string; content: string }>) {
  try {
    if (!process.env.DASHSCOPE_API_KEY) {
      throw new Error('DASHSCOPE_API_KEY is not set');
    }

    // @ts-ignore - Qwen API uses extra_body which is not in OpenAI types
    const completion = await qwenClient.chat.completions.create({
      model: "qwen3.5-flash",
      messages: messages as any,
      extra_body: { enable_thinking: true },
      stream: false,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Qwen API error:", error?.message || error);
    console.error("API Key present:", !!process.env.DASHSCOPE_API_KEY);
    console.error("Base URL:", process.env.QWEN_BASE_URL);
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
