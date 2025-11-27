import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

  const inputRef = useRef(null);
  useEffect(() => {
    const inputEl = inputRef.current;
    const handleFocus = () => {
      setTimeout(() => inputEl.scrollIntoView({ behavior: 'smooth', block: 'end' }), 300);
    };
    inputEl.addEventListener('focus', handleFocus);
    return () => inputEl.removeEventListener('focus', handleFocus);
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "sans-serif",
      alignItems: "center",
      padding: "20px"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "20px"
    },
    chatContainer: {
      width: "100%",
      maxWidth: "800px",
      height: "70vh",
      background: "#1a1a1a",
      border: "1px solid #333",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    messagesArea: {
      flex: 1,
      padding: "20px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    userBubble: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "15px",
      borderRadius: "20px",
      maxWidth: "80%",
      wordWrap: "break-word",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
    },
    aiBubble: {
      alignSelf: "flex-start",
      background: "white",
      color: "black",
      padding: "15px",
      borderRadius: "20px",
      maxWidth: "80%",
      wordWrap: "break-word",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },
    inputArea: {
      display: "flex",
      gap: "10px",
      padding: "20px",
      borderTop: "1px solid #333",
      background: "#1a1a1a"
    },
    input: {
      flex: 1,
      padding: "15px",
      borderRadius: "15px",
      border: "1px solid #444",
      outline: "none",
      background: "#2a2a2a",
      color: "white",
      fontSize: "16px"
    },
    button: {
      borderRadius: "15px",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontWeight: "bold",
      padding: "15px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    loading: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#ccc",
      fontStyle: "italic",
      padding: "10px"
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
      opacity: "0.7"
    }
  };

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.title}
      >
        Bishnu AI
      </motion.h1>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={msg.role === "user" ? styles.userBubble : styles.aiBubble}
            >
              <div style={styles.messageContent}>
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                <button
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  style={styles.copyButton}
                >
                  <Copy size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div style={styles.loading}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              Bishnu Sir is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Bishnu AI..."
            style={styles.input}
          />
          <button 
            onClick={sendMessage} 
            style={styles.button}
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