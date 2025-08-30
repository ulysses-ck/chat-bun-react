import { useEffect, useState } from "react";
import "./App.css";

type Message = {
  id: string;
  content: string;
  createdAt: string;
};

function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3000/chat");
    setWs(websocket);

    websocket.onopen = () => console.log("Connected to WebSocket server");
    websocket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data) as Array<Message>;
      console.log(parsedData);
      setMessages((prevMessages) => [...prevMessages, ...parsedData]);
    };
    websocket.onclose = () => console.log("Disconnected from WebSocket server");

    // Cleanup on unmount
    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify([{ content: input }]));
      setInput("");
    }
  };

  return (
    <div className="notification-center">
      <h2>Real-Time Notifications</h2>
      <div className="messages">
        {messages.map(({ content, createdAt, id }) => (
          <div key={`${id}`}>
            <p>{content}</p>
            <small>{createdAt}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
