import { Elysia, t } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    body: t.Object({
      message: t.String(),
    }),
    open(ws) {
      console.log(ws.id);
      const msg = `${ws.id} has entered to the chat`;
      ws.subscribe("chat");
      ws.publish("chat", { message: msg, time: Date.now() });
    },
    message(ws, { message }) {
      const data = {
        message,
        time: Date.now(),
      };
      ws.send(data);
      ws.publish("chat", data);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
