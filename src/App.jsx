import React, { useState, useEffect, useRef } from "react";
import { Send, Copy, Loader2 } from "lucide-react";

const OPENAI_KEY = process.env.VITE_OPENAI_KEY;

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

    if (/who made you|who is your creator|who created you/i.test(userInput)) {
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bishnu AI</h1>
      
      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={msg.role === "user" ? styles.userMessage : styles.aiMessage}
            >
              <div style={styles.messageContent}>
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                <button
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  style={styles.copyButton}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={styles.loading}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Bishnu Sir is thinking...
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
        
        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Bishnu AI..."
            style={styles.input}
          />
          <button 
            onClick={sendMessage} 
            style={styles.sendButton}
            disabled={loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "20px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
  },
  chatContainer: {
    flex: 1,
    margin: "0 20px 20px 20px",
    background: "white",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },
  messagesArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    background: "#f8f9fa"
  },
  userMessage: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "12px 16px",
    borderRadius: "18px",
    marginBottom: "10px",
    marginLeft: "auto",
    maxWidth: "70%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  aiMessage: {
    background: "white",
    color: "#333",
    padding: "12px 16px",
    borderRadius: "18px",
    marginBottom: "10px",
    marginRight: "auto",
    maxWidth: "70%",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  messageContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px"
  },
  copyButton: {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    opacity: "0.7",
    padding: "2px"
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#666",
    fontStyle: "italic",
    padding: "10px",
    fontSize: "14px"
  },
  inputContainer: {
    display: "flex",
    padding: "20px",
    gap: "10px",
    borderTop: "1px solid #e0e0e0",
    background: "white"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "25px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontSize: "16px",
    background: "#f8f9fa"
    color: "black"
  },
  sendButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }
};
