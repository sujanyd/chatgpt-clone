import { useState } from "react"

export default function OllamaChatUI() {

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  async function sendMessage() {

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input
    setInput("")

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: currentInput,
          stream: false
        })
      }
    )

    const data = await response.json()

    const aiMessage = {
      role: "ai",
      content: data.response
    }

    setMessages((prev) => [...prev, aiMessage])
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-4xl bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">

        <div className="p-4 border-b border-zinc-800 text-2xl font-bold">
          Local ChatGPT Clone
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-4">

          {messages.map((message, index) => (

            <div
              key={index}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >

              <div
                className={
                  message.role === "user"
                    ? "bg-white text-black px-4 py-3 rounded-2xl max-w-[70%]"
                    : "bg-zinc-800 px-4 py-3 rounded-2xl max-w-[70%]"
                }
              >
                {message.content}
              </div>

            </div>

          ))}

        </div>

        <div className="p-4 border-t border-zinc-800 flex gap-3">

          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 rounded-2xl px-4 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  )
}


// User Input
//     ↓
// React State
//     ↓
// fetch()
//     ↓
// Ollama API
//     ↓
// Llama3
//     ↓
// AI Response
//     ↓
// React Re-render