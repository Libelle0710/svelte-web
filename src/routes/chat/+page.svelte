<script>
// @ts-nocheck
    import ThemeSelector from "$lib/components/ThemeSelector.svelte";
    import { supabase } from "$lib/supabase.js"
	import ChatBubble from "$lib/components/chat/ChatBubble.svelte";
    import notificationSound from "$assets/notificationSound.mp3"
    
    
    export let data;



    let message = "";

//   let notificationSound = new Audio('C:\\Workspace\\web-apps-internal\\src\\assets\\notificationSound.mp3');//('https://sveltejs.github.io/assets/music/holst.mp3');//(`/${notificationSound.mp3}`);


    const messages = supabase.channel('any')
      .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
        data.messages?.push(payload.new);
        data.messages = data.messages;
        document.getElementById("myAudio").play();
        
    }).subscribe()

  let chatBubbles, chatBubblesHeight;
  async function handleSubmit(event) {
    console.log(message);
    const { data, error } = await supabase
    .from('messages')
    .insert([
        { username: 'Daniel', message: message },
    ])
    .select()

    message = "";
    event.preventDefault();
  }

  function playFirstSecond(audio) {
    audio.currentTime = 0; 
    audio.play();

    setTimeout(() => {
      audio.pause(); 
      audio.currentTime = 0;
    }, 1000); 
  }


  $:{
    
    chatBubblesHeight = chatBubblesHeight;
    scrollToChatPosition(chatBubblesHeight);
  }
  
  function scrollToChatPosition(position) {
    if (chatBubbles) {
            chatBubbles.scrollTo(0,position);
        }
    }
    
</script>
<div class="container flex mx-auto">

    <audio controls hidden id="myAudio">
        <source src={notificationSound} type="audio/mpeg">
      </audio>

    <div class="mockup-phone mx-auto">
        <div class="camera"></div> 
        <div class="display">
          <div class="artboard bg-secondary artboard-demo phone-1">

            <!-- HEADER WITH TITLE MESSAGES -->

            <div class="header bg-primary">
                <h1 class="font-black ">MESSAGES</h1>
            </div>

            <!-- CHAT BUBBLES -->
            <div class="chat-bubbles" bind:this={chatBubbles}>

                <div bind:offsetHeight={chatBubblesHeight}>
                {#each data.messages as message}

                    <ChatBubble sender="{message.username}" text="{message.message}" timeStamp="{message.created_at}"/>

                {/each}
                </div>


            </div>
           
              <!-- FOOTER WITH INPUT TEXT AND SEND BUTTON -->
            <form on:submit|preventDefault={handleSubmit}>
                <div class="send_input">
                    <input bind:value={message} type="text" placeholder="Type here" class="input input-bordered" />
                    <button type="submit" class="btn btn-primary">SEND</button>
                </div>
             </form>


          </div>
        </div>
      </div>    

      <button class="btn"><a href="/">GO BACK</a></button>
      

</div>

<style lang="scss">

    .chat-bubbles{
        padding: 3%;
        height: 850px;
        overflow-y: scroll;
    }

    .chat-bubbles::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    .mockup-phone {
        width: 700px;
        height: 1200px;
    }

    .artboard {
        width: 670px;
        display: block;
        height: 1070px;
    }

    .header {
        height: 120px;
        width: 100%;
    }

    h1{
        font-size: 30px;
        text-align: center;
        padding-top: 50px;
    }
    .send_input{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 20px;
        input{
            width: 75%;
            margin-right: 10px;
        }
        button {
            width: 15%;
            
        }
    }

</style>