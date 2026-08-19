const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-ws-H.DMPHPHM.GebG.MEUCIGCe_O6NGEA2_muZeS6QlLFVw4Tft2TLnq_NgdyrGI-QAiEAmt0BQn7KNevSS9kqRwyLJhPNS9fW4uFxqvaitua_rLY';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';

export async function qwenChat(messages: Array<{ role: string; content: string }>) {
  try {
    if (!DASHSCOPE_API_KEY) {
      throw new Error('DASHSCOPE_API_KEY is not set');
    }

    console.log('Calling Qwen API...');

    const requestBody = {
      model: 'qwen3.5-flash',
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
      stream: false,
      enable_thinking: true
    };

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Qwen API error:', errorData);
      throw new Error(errorData.error?.message || JSON.stringify(errorData) || 'Qwen API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim() === '') {
      throw new Error('AI не дал ответ. Попробуйте еще раз.');
    }

    console.log('Qwen API response received successfully');
    return aiResponse;

  } catch (error: any) {
    console.error("Qwen API error:", error?.message || error);
    console.error("API Key present:", !!DASHSCOPE_API_KEY);
    console.error("Base URL:", BASE_URL);
    throw error;
  }
}

export async function qwenChatStream(messages: Array<{ role: string; content: string }>) {
  try {
    if (!DASHSCOPE_API_KEY) {
      throw new Error('DASHSCOPE_API_KEY is not set');
    }

    const requestBody = {
      model: 'qwen3.5-flash',
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
      stream: true,
      enable_thinking: true
    };

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Qwen API stream error:', errorData);
      throw new Error(errorData.error?.message || 'Qwen API stream error');
    }

    return response.body;
  } catch (error: any) {
    console.error("Qwen API stream error:", error?.message || error);
    throw error;
  }
}
