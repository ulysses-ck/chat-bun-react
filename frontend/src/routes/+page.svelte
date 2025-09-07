<script lang="ts">
  import { treaty } from "@elysiajs/eden";
  import { type App } from "../../../backend/src";

  let messages: Array<Message> = $state([]);
  let message: string = $state("");

  type Message = {
    id: string;
    content: string;
    createdAt: string;
  };

  const api = treaty<App>("localhost:3000");

  const chat = api.chat.subscribe();

  chat.subscribe((content) => {
    console.log("Subscribing");
    console.log(content);
  });

  chat.on("open", (data) => {
    console.log("openning");
    console.log(data);
  });

  $effect(() => {
    chat.on("message", (content) => {
      console.log("messaging");
      console.log(content);
      messages.push(...(content.data as Array<Message>));
    });
  });

  function sendMessage() {
    console.log(message)
    if(message) {
        chat.send(
      JSON.stringify([
        {
          content: message,
        },
      ])
    );
    }
  }

  function updateMessage(str: string) {
    message = str
  }
</script>

<h1>Chat</h1>

<div>
  <div class="list">
    {#each messages as message}
      <div class="message">
        <span>{message.content}</span>
        <small title={new Date(message.createdAt).toLocaleTimeString()}
          >{new Date(message.createdAt).toLocaleTimeString()}</small
        >
      </div>
    {/each}
  </div>

  <div>
    <input type="text" onchange={e => updateMessage(e.target.value)} value={message} />
    <button type="button" onclick={(e) => sendMessage()}>Send</button>
  </div>
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
  }
  .message {
    display: inline-flex;
  }
</style>
