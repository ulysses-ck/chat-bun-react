import { Elysia, t } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    body: t.Object({
      message: t.String(),
    }),
    message(ws, { message }) {
      ws.send({
        message,
        time: Date.now(),
      });
    },
    open(ws) {
      console.log(ws.id);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
