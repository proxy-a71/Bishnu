import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Copy, Loader2 } from "lucide-react";

const OPENAI_KEY = "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";

export default function BishnuAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!window.MathJax) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    if (/who made you/i.test(userInput)) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Zsateishiish aka Samarpan Aree made me - take's him 2 months to make me!!" },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Bishnu AI, a math teacher. Always show step-by-step solutions and use LaTeX formatting for math." },
            { role: "user", content: userInput }
          ],
          temperature: 0.2,
          max_tokens: 1000
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "(No response)";

      setMessages((m) => [...m, { role: "assistant", text }]);

    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Error communicating with OpenAI API." }]);
    }

    setLoading(false);
  }

  const inputRef = useRef(null);
  useEffect(() => {
    const inputEl = inputRef.current;
    const handleFocus = () => {
      setTimeout(() => inputEl.scrollIntoView({ behavior: 'smooth', block: 'end' }), 300);
    };
    inputEl.addEventListener('focus', handleFocus);
    return () => inputEl.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="w-full h-screen bg-neutral-950 text-white flex flex-col items-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        Bishnu AI
      </motion.h1>

      {/* Replaced Card with div */}
      <div className="w-full max-w-2xl h-[80vh] bg-neutral-900 border border-neutral-800 flex flex-col rounded-2xl">
        {/* Replaced CardContent with div */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-wrap shadow-lg ${
                msg.role === "user" ? "bg-violet-600 ml-auto" : "bg-white text-black"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                <button
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  className="opacity-50 hover:opacity-100"
                >
                  <Copy size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-neutral-400 p-2">
              <Loader2 className="animate-spin" />
              Bishnu Sir is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-3 flex gap-2 border-t border-neutral-800">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Bishnu AI..."
            className="flex-1 p-3 rounded-xl bg-neutral-800 border border-neutral-700 outline-none text-white placeholder-gray-400"
          />
          {/* Replaced Button with button */}
          <button 
            onClick={sendMessage} 
            className="rounded-xl px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            disabled={loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
