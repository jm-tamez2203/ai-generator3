import { useState, type FormEvent } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "./App.css";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import amplifyOutputs from "./amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(amplifyOutputs);
const client = generateClient<Schema>({ authMode: "apiKey" });

type Message = {
  sender: "Tú" | "Asesor";
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const question = input.trim();
    const context = messages.at(-1)?.text || "";

    setMessages((prev) => [...prev, { sender: "Tú", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data, errors } = await client.queries.askBedrock({
        question,
        context,
      });

      if (errors) {
        console.error(errors);
        setMessages((prev) => [
          ...prev,
          { sender: "Asesor", text: "Ocurrió un error al procesar la pregunta." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "Asesor", text: data?.body || "Sin respuesta del modelo." },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "Asesor", text: "Error de red o sistema. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="main-header">Chat con IA</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender === "Tú" ? "user" : "bot"}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <strong>Asesor:</strong> <Loader size="small" />
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          className="wide-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;
