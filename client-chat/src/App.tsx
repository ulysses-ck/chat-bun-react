import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<
    Array<{
      message: string;
      time: string;
    }>
  >([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3000/ws");
    setWs(websocket);

    websocket.onopen = () => console.log("Connected to WebSocket server");
    websocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };
    websocket.onclose = () => console.log("Disconnected from WebSocket server");

    // Cleanup on unmount
    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  return (
    <div className="notification-center">
      <h2>Real-Time Notifications</h2>
      <div className="messages">
        {messages.map(({ message, time }, index) => (
          <div key={`${index}`}>
            <p>{message}</p>
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
