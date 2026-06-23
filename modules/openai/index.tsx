import { FormEvent, useMemo, useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';

export default function Home() {
  const [input, setInput] = useState('');
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { error, messages, sendMessage, status, stop } = useChat({ transport });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || status === 'submitted' || status === 'streaming') {
      return;
    }

    await sendMessage({ text: input });
    setInput('');
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h2>Vercel AI SDK 聊天 Demo</h2>
      <p style={{ color: '#666' }}>
        当前页面使用 <code>useChat</code> 管理消息，后端 <code>/api/chat</code> 使用 <code>streamText</code> 流式返回。
      </p>

      <div style={{ border: '1px solid #eee', borderRadius: 8, minHeight: 280, padding: 16, marginBottom: 16 }}>
        {messages.length === 0 ? (
          <div style={{ color: '#999' }}>试着问：什么是 AI Agent？前端开发者应该怎么入门？</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={{ marginBottom: 16 }}>
              <strong>{message.role === 'user' ? '你' : 'AI'}：</strong>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>
                {message.parts
                  .map((part, index) => (
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            style={{ flex: 1, padding: '8px 12px' }}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? '生成中...' : '发送'}
          </button>
          {isLoading && (
            <button type="button" onClick={() => stop()}>
              停止
            </button>
          )}
        </div>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: 12 }}>
          请求出错：{error.message}
        </div>
      )}
    </div>
  );
}