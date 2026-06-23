import type { NextApiRequest, NextApiResponse } from "next";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ErrorResponse = {
  error?: string;
  details?: string;
};

const deepseek = createOpenAI({
  name: "deepseek",
  baseURL: process.env.DEEPSEEK_API_BASEURL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  try {
    const { messages = [] } = req.body as { messages?: UIMessage[] };

    const result = streamText({
      model: deepseek.chat("deepseek-chat"),
      system: "你是一个耐心的 AI Agent 开发老师，回答时尽量用前端开发者能理解的方式解释。",
      messages: await convertToModelMessages(messages),
    });

    result.pipeUIMessageStreamToResponse(res);

  } catch (error) {
    console.error('DeepSeek API 错误:', error);
    const message = error instanceof Error ? error.message : '未知错误';

    res.status(500).json({
      error: "AI 服务暂时不可用",
      details: message // 可选：生产环境建议移除错误详情
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};