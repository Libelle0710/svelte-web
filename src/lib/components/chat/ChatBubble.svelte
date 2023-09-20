<script lang="ts">

    export let classes = ""
    export let sender = "";
    export let timeStamp = "";
    export let text = "";
    export let align = sender === "User" ? "end" : "start";



</script>


<div class="chat chat-{align} {classes}">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img src="https://placekitten.com/30/30" />
      </div>
    </div>
    <div class="chat-header">
        {sender}
      <time class="text-xs opacity-50">{timeStamp}</time>
    </div>
    <div class="chat-bubble">{text}</div>
    <div class="chat-footer opacity-50">
      Delivered
    </div>
  </div>