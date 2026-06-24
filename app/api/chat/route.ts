import { NextRequest } from "next/server";
import { streamText,convertToModelMessages } from 'ai'
import { createDeepSeek } from "@ai-sdk/deepseek";
const deepSeek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY || '',
});
export async function POST(req: NextRequest) {
    const { messages } = await req.json(); 
    const result = streamText({
        model: deepSeek('deepseek-chat'), 
        messages:await convertToModelMessages(messages),
        system: '你是一个高级程序员，请根据用户的问题给出回答',
    });
   
    return result.toUIMessageStreamResponse()
}