<script lang="ts">
  import { treaty } from "@elysiajs/eden";
  import { type App } from "@backend/index";

  let messages: Array<Message> = $state([]);
  let message: string = $state("");

  type Message = {
    id: string;
    content: string;
    createdAt: string;
  };

  const api = treaty<App>("localhost:3000");

  const chat = api.chat.subscribe();

  $effect(() => {
    const onMessage = (data: Array<Message>) => {
      console.log(data)
      messages.push(...data);
    };

    chat.on("message", (content) => onMessage(content.data as Array<Message>));

    return () => {
      chat.off("message", (content) => onMessage(content.data as Array<Message>));
    };
  });

  function sendMessage() {
    if (message) {
      chat.send(
          {
            content: message,
          }
      );
    }

    message = "";
  }
</script>
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
    <input type="text" bind:value={message} />
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
