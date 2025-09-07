import { Elysia, t } from "elysia";
import { db } from "./db";
import { messageTable } from "./db/schema";

const app = new Elysia()
  .ws("/chat", {
    body: t.Array(
      t.Object({
        id: t.Optional(t.String()),
        content: t.String(),
        createdAt: t.Optional(t.String()),
      })
    ),
    async open(ws) {
      console.log(ws.id);
      const msg = `${ws.id} has entered to the chat`;
      const historialMessages = await db.query.messageTable.findMany();
      ws.subscribe("chat");
      ws.send(historialMessages)
      ws.publish("chat", [
        { content: msg, id: ws.id, createdAt: new Date().toISOString() },
      ]);
    },
    async message(ws, body) {
      const result = await db.insert(messageTable).values({content: body[0].content}).returning();
      ws.send(result);
      ws.publish("chat", result);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
