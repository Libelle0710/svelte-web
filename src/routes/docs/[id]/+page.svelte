<script lang="ts">
    import {Text, Link2} from "lucide-svelte";
    import {onMount} from "svelte";
    import {supabase} from "$lib/supabase";
    import ToolBox from "$lib/components/ToolBox.svelte";
    import LanguageSelector from "$lib/components/LanguageSelector.svelte";
    import CopyButton from "$lib/components/CopyButton.svelte";
    import {csharp, vbscriptHtml, javascript, c} from "svelte-highlight/languages";
    import Highlight from "svelte-highlight";
    import LineNumbers from "svelte-highlight";
    import hljs from 'highlight.js';
    import typescript from 'highlight.js/lib/languages/typescript';
    import 'highlight.js/styles/github-dark.css';
    import 'tippy.js/dist/tippy.css';
    import {Icon} from 'flowbite-svelte-icons';
    import {Button} from "flowbite-svelte";
    import {ButtonType} from "../../../enum/buttontype";
    hljs.registerLanguage('typescript', typescript);
    import {fade, fly, slide, blur,scale, crossfade} from 'svelte/transition';
    import Switch from '$lib/components/Switch.svelte';
    import {getPosts, posts} from "$lib/stores/stores";
    import{ FileUp, RotateCw } from "lucide-svelte";
	import { list } from "postcss";
	import Toolbox from "$lib/components/toolbox/Toolbox.svelte";
    

    export let data;
    let postID = data.id;
    let post: { id:number; created_at: any; title: any; blocks: any[]; short_description: any; };
    $:{
        post = $posts.find((p) => p.id == postID) ;
    }

    let dragIndex: number | null = null;
    let dropIndex: number;
    let touched: boolean[] = [];
    let update: boolean[] = [];
    let editable = false;
    let postDraggablity = false;

    let postSubscription = null;
    let divReferences: HTMLDivElement[] = [];
    let dragdivReferences: HTMLDivElement[] = [];
    const tableName = data.name;
    const bucketName = 'bucky';
    let isInProgress = false;
    let isUploading = false;
    let saveAlert = false;

    let uploadFiles: { timeStamp: string; file: any; }[] = [];

    onMount(() => {
        // if (document.addEventListener) {
        //   document.addEventListener('contextmenu', function(e) {
        //     console.log("bla");
        //     e.preventDefault();

        //   }, false);
        // } else {
        //   document.attachEvent('oncontextmenu', function() {

        //     console.log("blabla");

        //     // window.event.returnValue = false;
        //   });
        // }
        postSubscription = getPosts();
        setTimeout(() => {
            for(const block of post.blocks){ 
                if(block.type == "File"){
                    loadFile(block.classes, block.orderIndex, block.codeText);  //loadFile only after components are created
                }
            }
        }, 1000);
    });

    document.addEventListener('keydown', function (event) { 

        if (event.ctrlKey && event.key == 's') {
            isInProgress = true;
            if(isInProgress && editable) {
                event.preventDefault();
                handleStyling("Save");
            }
            setTimeout(() => {isInProgress = false;}, 500);
        }
        else if(event.ctrlKey && event.key == 'Backspace'){
            isInProgress = true;
            if(isInProgress && editable) {
                event.preventDefault();
                updatePostsContent();
                handleStyling("Trash");
            }
            setTimeout(() => {isInProgress = false;}, 500);
        }
        else if(event.ctrlKey && event.key == 'u'){
            isInProgress = true;
            if(isInProgress && editable) {
                event.preventDefault();
                handleStyling("Upload");
            }
            setTimeout(() => {isInProgress = false;}, 500);
        }
        else if(event.shiftKey && event.key == 'Tab'){
            event.preventDefault();
            editable = !editable;
        }
        
    })

    document.addEventListener('paste', async (e) => {
        e.preventDefault();
        const clipboardText = await navigator.clipboard.readText();
        document.execCommand('insertText', false, clipboardText);
    });


    async function updateSupabase() {

        const {error } = await supabase
        .from('posts')
        .update({ blocks:  post.blocks, title: post.title, short_description: post.short_description })
        .eq('id', postID)
        .select()
        if(error) {
            console.log(error);
            return;
        }

        for(const block of post.blocks){ //add classes in bucket (in posts, but not yet in bucky)
            if(block.type=="File"){
                var file = uploadFiles.find(f => f.timeStamp == block.classes)?.file;
                const { error: uploadError} = await supabase.storage.from(bucketName).upload(postID + "/" + block.classes, file);
                if(error) {
                    console.log(error);
                    return;
                }
            }
        }

        const {data} = await supabase.storage.from(bucketName).list(postID); // delete classes in bucket (in bucky but not posts)
        if (data && data.length > 0) {
            const fileNamesInBucket = data.map(file => file.name);
            const classesInPostBlocks = post.blocks.filter(b => b.type == "File").map(file => file.classes);
            const filesToDelete = fileNamesInBucket.filter(fileName => !classesInPostBlocks.includes(fileName));
            const paths = filesToDelete.map(fileName => `${postID}/${fileName}`);
            if(paths.length > 0){
                const {error} = await supabase.storage.from(bucketName).remove(paths);
                if(error) {
                    console.log(error);
                    return;
                }
            }
        }
    }

    function updatePostTitle(newTitle: string){
        $posts.find((post) => post.id == postID).title = newTitle;
        post.title = post.title;
    }

    function updatePostShortDesciption(newDescription: string){
        $posts.find((post) => post.id == postID).short_description = newDescription;
        post.short_description = post.short_description;
    }

    function updatePostsLanguage(index: number, selectedLanguage: string) {
        $posts.find((post) => post.id == postID).blocks[index].language = selectedLanguage;
        post.blocks[index].language = post.blocks[index].language;
    }

    function updatePostsOrderIndex(dragIndex: number, dropIndex: number) {
            if (dragIndex > dropIndex) {
                for (let i = dropIndex; i <= dragIndex - 1; i++) {
                    $posts.find((post) => post.id == postID).blocks[i].orderIndex += 1;
                }
            } else {
                for (let i = dropIndex; i >= dragIndex + 1; i--) {
                    $posts.find((post) => post.id == postID).blocks[i].orderIndex += -1;
                }
            }
            $posts.find((post) => post.id == postID).blocks[dragIndex].orderIndex = dropIndex;

            post.blocks=post.blocks;
    }

    function updatePostsContent() {
        
        if (post) {
            for (let i = 0; i < post.blocks.length; i++) {
                if (post.blocks[i].type == "Code") {
                    if (divReferences[i].innerText != post.blocks[i].codeText) {
                        updatePostsCodeText(i);
                    }
                }
                else if(post.blocks[i].type == "File"){
                    if (divReferences[i].firstChild?.lastChild?.textContent != post.blocks[i].codeText) {
                        updatePostsFileName(i);
                    }
                }
                else {
                    if (divReferences[i].innerHTML != post.blocks[i].contents) {
                        updatePostsTextContent(i);
                    }
                }
            }
        }
    }

    function updatePostsFileName (index: number){
        let updatedName= divReferences[index].firstChild?.lastChild?.textContent;
        divReferences[index] = divReferences[index];
        $posts.find((post) => post.id == postID).blocks[index].codeText = updatedName;
        post.blocks[index].codeText = post.blocks[index].codeText;
    }

    function updatePostsCodeText(index: number) {
        update[index] = true; 
        let updatedCode = divReferences[index].innerText;
        divReferences[index] = divReferences[index];
        $posts.find((post) => post.id == postID).blocks[index].codeText = updatedCode;
        post.blocks[index].codeText = post.blocks[index].codeText;
        setTimeout(() => {
            update[index] = false;
        }, 100); 
    }

    function updatePostsTextContent(index: number) {
        let updatedText = divReferences[index].innerHTML;
        divReferences[index].innerHTML = '' ;
        $posts.find((post) => post.id == postID).blocks[index].contents = updatedText;
        post.blocks[index].contents = post.blocks[index].contents;
        
    }

    function updatePostsClasses(label: any, index: number, existingClasses: string, add: boolean) {
        if(add){
            $posts.find((post) => post.id == postID).blocks[index].classes = existingClasses + ' ' + label;
        }
        else{
            $posts.find((post) => post.id == postID).blocks[index].classes = existingClasses;
        }
        post.blocks[index].classes = post.blocks[index].classes;
        

    }

    function addPostsBlocksEntry(type:string, contents: string){
        const length = post.blocks?.length;
        $posts.find((post) => post.id == postID).blocks.push({
                    "type": type,
                    "classes": "",
                    "codeText": "",
                    "contents": contents, 
                    "language":"HTML",
                    "orderIndex": length,
              });
        post.blocks[length]=post.blocks[length];
    }
    
    function deletePostsBlocksEntry(orderIndex: number){
        const blocksLength = $posts.find((post) => post.id == postID)?.blocks.length;
        $posts.find((post) => post.id == postID).blocks = post.blocks.filter((block: { orderIndex: number; }) => block.orderIndex !== orderIndex);
        if ($posts.find((post) => post.id == postID)?.blocks[orderIndex]) {
                            for (let i = orderIndex; i < blocksLength-1; i++) { //calculate new orderIndex
                                divReferences[i] = divReferences [i+1]; //without this, CTRL+Backspace HTML is not updated, although handleStyling("Trash") works just fine without directly update the div.
                               $posts.find((post) => post.id == postID).blocks[i].orderIndex += -1;
                            }
                        }
        
        post.blocks = post.blocks;

        setTimeout(() => {divReferences[orderIndex-1].focus()}, 50);
    }

    function insertPostRowAt(orderIndex: number){
        const blocksLength = post.blocks?.length;
        if ($posts.find((post) => post.id == postID)?.blocks[orderIndex]) {
                    for (let i = orderIndex; i < blocksLength; i++) { //calculate new orderIndex
                        $posts.find((post) => post.id == postID).blocks[i].orderIndex += 1;
                    }
                }
        $posts.find((post) => post.id == postID).blocks.push({
                    "orderIndex": orderIndex,
                    "type": "Text",
                    "contents": "", 
                    "language":"HTML",
                    "codeText": "",
                    "classes": "",
              });
        post.blocks=post.blocks;
    }

    function handleStyling(type: string ) {
        if (type == ButtonType.Text || type == ButtonType.Quote || type == ButtonType.Code || type == ButtonType.Link) {
            addPostsBlocksEntry(type, "");
        } else if (type == 'Trash') {
            if (window.getSelection()) {
                const selection = window.getSelection();
                const div = selection?.focusNode?.parentElement as HTMLDivElement;
                let divWhile = div;
                let deleteOrderIndex = -1;
                while (deleteOrderIndex == -1 && divWhile != div.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement) {
                    if (!divWhile) break; // case no div is from begining.
                    deleteOrderIndex = dragdivReferences.findIndex(element => element === divWhile)
                    if (divWhile.parentElement)
                        divWhile = divWhile.parentElement as HTMLDivElement;
                    else
                        break;
                }
                if (deleteOrderIndex != -1) //if div founded
                {
                    deletePostsBlocksEntry(deleteOrderIndex);
                }
            }
        } else if (type == 'Upload') {
            const fileDropZone = document.getElementById('fileDropZone');
            if (fileDropZone) {
                fileDropZone.scrollIntoView({ behavior: 'smooth',block: 'center' }); 
            }
            

            document.getElementById('fileInput')?.click();
            document.getElementById('fileInput')?.addEventListener('change', async (e) => {
                const file = e.target?.files[0];
                if(!isUploading){
                    isUploading = true;
                    const timeStamp = Date.now().toString();
                    uploadFiles.push({timeStamp, file});
                    addPostsBlocksEntry("File", file.name);
                    displayFile(timeStamp, post?.blocks.length-1, file);
                    setTimeout(() => {
                        isUploading = false;
                    }, 500);
                }

            });
        } else if (type == 'Save') {
            updatePostsContent();
            updateSupabase();
            saveAlert =true;
            setTimeout(() => {saveAlert = false;}, 1500); 
        } else { //Styling
            if (window.getSelection()) {
                    const selection = window.getSelection();
                    const div = selection?.focusNode?.parentElement as HTMLDivElement;
                    let divWhile = div;
                    let index = -1;
                    while (index == -1 && divWhile != div.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement) {
                        if (!divWhile) break; // case no div is from begining.
                        index = dragdivReferences.findIndex(element => element === divWhile)
                        if (divWhile.parentElement)
                            divWhile = divWhile.parentElement as HTMLDivElement;
                        else
                            break;
                    }
                    if (index != -1){
                            var classArray = Array.from(divReferences[index].classList);
                            //The last element is id of div
                            classArray.splice(-1);

                            var filteredClassArray = classArray;
                            let label = type.toLowerCase();
                            
                            //Choosing a style twice => back to normal
                            if (classArray.includes(label)) {
                                filteredClassArray = classArray.filter(className => ![label].includes(className));
                                const existingClasses = filteredClassArray.join(' ');
                                updatePostsClasses(label, index, existingClasses, false);
                            } else {
                                //The headings are not combinable
                                if (['heading1', 'heading2', 'heading3'].includes(label)) {
                                    filteredClassArray = classArray.filter(className => !['heading1', 'heading2', 'heading3'].includes(className));
                                }
                            
                                //The alignments are not combinable
                                if (['alignleft', 'aligncenter', 'alignright'].includes(label)) {
                                    filteredClassArray = classArray.filter(className => !['alignleft', 'aligncenter', 'alignright'].includes(className));
                                }

                                //The colours are not combinable
                                if (['black', 'white', 'grey', 'red', 'blue', 'yellow', 'violet', 'orange', 'green', 'primary', 'secondary'].includes(label)) {
                                    filteredClassArray = classArray.filter(className => !['black', 'white', 'grey', 'red', 'blue', 'yellow', 'violet', 'orange', 'green', 'primary', 'secondary'].includes(className));
                                }
                            
                                //Combining classes together
                                const existingClasses = filteredClassArray.join(' ');
                                updatePostsClasses(label, index, existingClasses, true);
                            
                    }
                }
            }
        }
    }

    function getHighlightLanguage(languageFromPost: string) {

        if (languageFromPost == "C#")
            return csharp;
        else if (languageFromPost == "JavaScript")
            return javascript;
        else if (languageFromPost == "C")
            return c;
        else
            return vbscriptHtml;
    }

    async function loadFile(timeStamp: string, index: number, fileName: string){
        const { data } = await supabase.storage.from(bucketName).list(postID);

        const listItem = document.createElement('div');
        listItem.style.padding = "10px";
        listItem.style.width = 'fit-content';

        let file = data?.filter(f => f.name == timeStamp)[0];

        if(file){

            if (file.metadata.mimetype.startsWith('image/')) {
                // Handle image files
                const image = document.createElement('img');
                const { data, error } = await supabase.storage.from(bucketName).download(postID+"/"+timeStamp);
                if(data){
                image.src = URL.createObjectURL(data);
                }
                if(error) console.log(error);

                image.alt = fileName;
                image.style.maxBlockSize = '500px';
                image.draggable = false;
                listItem.appendChild(image);
            }else if (file.metadata.mimetype.startsWith('audio/')) {
                // Handle audio files
                const audio = document.createElement('audio');
                audio.controls = true; // Display audio controls
                const { data, error } = await supabase.storage.from(bucketName).download(postID+"/"+timeStamp);
                if(data){
                    const source = document.createElement('source');
                    source.src = URL.createObjectURL(data);
                    audio.appendChild(source);
                }
                if(error) console.log(error);
    
                    listItem.appendChild(audio);
            }else if (file.metadata.mimetype.startsWith('video/')) {
                // Handle video files
                const video = document.createElement('video');
                video.controls = true; // Display video controls
                const { data, error } = await supabase.storage.from(bucketName).download(postID+"/"+timeStamp);
                if(data){
                    const source = document.createElement('source');
                    source.src = URL.createObjectURL(data);
                    video.appendChild(source);
                }
                if(error) console.log(error);
                        
                video.style.maxBlockSize = '500px';
                listItem.appendChild(video);
                
            }else {
                // Handle other types of files
                const nameSpan = document.createElement('span');
                nameSpan.textContent = fileName
                listItem.appendChild(nameSpan);
            }
            $posts.find((post) => post.id == postID).blocks[index].contents = listItem.outerHTML;
            $posts.find((post) => post.id == postID).blocks[index].classes = timeStamp;
            $posts.find((post) => post.id == postID).blocks[index].codeText = fileName;
            post[index] = post[index];

        }
        

    }

    function displayFile(timeStamp: string, index:number, file: any){

        const listItem = document.createElement('div');
        listItem.style.padding = "10px";
        listItem.style.width = 'fit-content';

        if(file){
            if (file.type.startsWith('image/')) {
                // Handle image files
                const image = document.createElement('img');
                image.src = URL.createObjectURL(file);
                image.alt = file.name;
                image.style.maxBlockSize = '500px';
                image.draggable = false;
                listItem.appendChild(image);
            }else if (file.type.startsWith('audio/')) {
                // Handle audio files
                const audio = document.createElement('audio');
                audio.controls = true; // Display audio controls
                const source = document.createElement('source');
                source.src = URL.createObjectURL(file);
                audio.appendChild(source);
                listItem.appendChild(audio);
            }else if (file.type.startsWith('video/')) {
                // Handle video files
                const video = document.createElement('video');
                video.controls = true; // Display video controls
                const source = document.createElement('source');
                source.src = URL.createObjectURL(file);
                video.appendChild(source);
                video.style.maxBlockSize = '500px';
                listItem.appendChild(video);
                
            }else {
                // Handle other types of files
                const nameSpan = document.createElement('span');
                nameSpan.textContent = file.name
                listItem.appendChild(nameSpan);
            }
            $posts.find((post) => post.id == postID).blocks[index].contents = listItem.outerHTML;
            $posts.find((post) => post.id == postID).blocks[index].classes = timeStamp;
            $posts.find((post) => post.id == postID).blocks[index].codeText = file.name;
            post[index] = post[index];

            }

    }

    function handleDragDrop(e: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }) {

        const currentdropIndex = dragdivReferences.findIndex((element) => element == e.currentTarget);
        dropIndex = currentdropIndex;
        if (dragIndex === null || dragIndex === currentdropIndex || currentdropIndex === null) return;
        updatePostsOrderIndex(dragIndex, currentdropIndex);
    }

    function handleDragStart(e: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }, index: number) {
        updatePostsContent();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
        dragIndex = index;
    }

    function handleDragOver(e: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }, index: number) {
        e.preventDefault();
        touched[index] = true; 
    }

    function handleDragLeave(e: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }, index: number){
        if (!isChildOf(e.relatedTarget as HTMLDivElement, dragdivReferences[index]))
            touched[index] = false;
    }

    function handleDragEnd( ) {
        touched[dropIndex] = false;
        postDraggablity = false;
    }

    function isChildOf(child: HTMLDivElement, parent: HTMLDivElement) {
        while (child !== null) {
            if (child === parent) {
                return true;
            }
            child = child.parentElement as HTMLDivElement;
        }
        return false;
    }

    function handleKeyTabPress(event: { key: string; preventDefault: () => void; }) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const tabCharacter = '\t'; 
            document.execCommand('insertText', false, tabCharacter);
        }
    }

    function handleKeyPress(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement; }, index: number){
        if (event.code == 'Enter' && event.ctrlKey) {
            insertPostRowAt(index+1);
            setTimeout(() => {divReferences[index+1].focus()}, 50);
        }
    }

    function handleDropZoneDragOver(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }){
        event.preventDefault();
        document.getElementById('dropzone')?.classList.add('highlight');
    }

    function handleDropZoneDragLeave(){
        document.getElementById('dropzone')?.classList.remove('highlight');
    }

    function handleDropZoneDragDrop(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement; }){
        event.preventDefault();
        document.getElementById('dropzone')?.classList.remove('highlight');
        const file = event.dataTransfer?.files[0];
        if(file){
            const timeStamp = Date.now().toString();   
            uploadFiles.push({timeStamp, file});
            addPostsBlocksEntry("File", file.name);
            displayFile(timeStamp, post?.blocks.length-1, file);    
        }
    }

</script>

{#if saveAlert}
    <div style="display: flex; align-items: center; justify-content: center;">
        <div class = "save-message"  transition:fade|local={{duration:300}} >Post saved!</div>
    </div>
{/if}
{#if editable}
    <div class="toolbox-container" transition:fade|local={{duration:300}}>
      <ToolBox  on:buttonPressed={e => {handleStyling(e.detail.type)}}/>
    </div>
{/if}

<div class = "mt-40 ml-5">
    <Switch bind:checked={editable} label="" design="inner" />
</div>

<div class="container mx-auto mb-10 mt-30" style="user-select: auto; ">

        <input id="fileInput" hidden type="file"/>

        <div contenteditable={editable} class="m-10" spellcheck="false" on:input={(event) => updatePostTitle(event.target?.textContent)} ><h1 class="text-center text-6xl">{post?.title}</h1></div>
        <div contenteditable={editable} class="m-10" spellcheck="false" on:input={(event) => updatePostShortDesciption(event.target?.textContent)} ><h1 class="text-center text-xl">{post?.short_description}</h1></div>
    
    
            {#if post && post.blocks}
                {#each post.blocks.sort((a, b) => a.orderIndex - b.orderIndex) as block, index}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        draggable={postDraggablity && editable} 
                        on:dragstart={event => handleDragStart(event, index)}
                        on:dragend={handleDragEnd}
                        on:dragover={event => handleDragOver(event, index)}
                        on:dragleave={event => handleDragLeave(event, index)}
                        on:drop={event => handleDragDrop(event)}
                        bind:this={dragdivReferences[index]} 
                        on:keypress={event => handleKeyPress(event, index)}>
                            {#if block.type == 'Quote'}
                                <div class="container p-10"  on:mousedown={() => postDraggablity=true} spellcheck="false" on:mouseup={() => postDraggablity=false}>
                                    {#if editable}
                                            <Icon name="quote-solid" class="w-10 h-10"/>
                                    {/if}
                                    <div class=" {block.classes}  custom-blockquote heading3 flex-grow" contenteditable={editable}
                                         bind:this={divReferences[index]} on:blur={updatePostsContent}>
                                        {@html block.contents}
                                    </div>
                                </div>
                                {#if touched[index]}
                                    <div class="m-1 h-1 line"></div>
                                {/if}

                            {:else if block.type == 'Code'}
                                <div class="p-10" on:mousedown={() => postDraggablity = true} on:mouseup={() => postDraggablity=false}>
                                    <LanguageSelector bind:selected_language={block.language}
                                                    on:languageSelected={e => (updatePostsLanguage(index, e.detail.value))}/>
                                    <Highlight code={block.language} language={getHighlightLanguage(block.language)}></Highlight>
                                    {#key update[index]}
                                        <div style="background-color: black;" spellcheck="false" contenteditable={editable} bind:this={divReferences[index]} on:blur={updatePostsContent} on:keydown={handleKeyTabPress}>
                                                <Highlight code={block.codeText} language={getHighlightLanguage(block.language)}></Highlight>
                                        </div>
                                    {/key}
                                    <CopyButton code={block.codeText}></CopyButton>
                                </div>
                                {#if touched[index]}
                                    <div class="m-1 h-1 line"></div>
                                {/if}
                            {:else if block.type == 'Hyperlink'}
                                <div class=" flex items-center p-10" on:mousedown={() => postDraggablity = true} on:mouseup={() => postDraggablity=false}>
                                    {#if editable}
                                            <Link2 class="mr-5"/>
                                    {/if}
                                    <div class="flex-grow mr-5 custom-link underline" spellcheck="false" contenteditable={editable}
                                        bind:this={divReferences[index]} on:blur={updatePostsContent}>
                                        {@html block.contents}
                                    </div>
                                </div>
                                {#if touched[index]}
                                    <div class="m-1 h-1 line"></div>
                                {/if}

                            {:else if block.type == 'File'}
                                    <div class="p-5" on:mousedown={() => postDraggablity = true} on:mouseup={() => postDraggablity=false}>
                                        <div bind:this={divReferences[index]} >
                                            <div style="cursor:pointer;">
                                                <button class="btn" on:click={() => loadFile(block.classes, index, block.codeText)}><RotateCw/></button>
                                                {@html block.contents} 
                                                <div spellcheck="false" contenteditable={editable} on:blur={updatePostsContent} style= "padding: 10px;">
                                                    {block.codeText}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {#if touched[index]}
                                        <div class="m-1 h-1 line"></div>
                                    {/if}
                            {:else}
                                <div class=" flex items-center m-5" on:mousedown={() => postDraggablity = true} on:mouseup={() => postDraggablity=false}>
                                    {#if editable}
                                            <Text class="mr-5"/>
                                    {/if}
                                    <div class=" {block.classes} flex-grow mr-5" spellcheck="false" contenteditable={editable}
                                        bind:this={divReferences[index]} on:blur={updatePostsContent}>
                                        {@html block.contents}
                                    </div>
                                </div>
                                {#if touched[index]}
                                    <div class="m-1 h-1 line"></div>
                                {/if}
                            {/if}
                    </div>
                {/each}
            {/if}
        

        
        <h1 class="text-4xl m-10" style=" display: flex; align-items: center;"><div class="m-5"><FileUp /></div>Attachments:</h1>
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="dropzone">
            <div class="text-center drop-zone"
                on:dragover={event => handleDropZoneDragOver(event)}
                on:dragleave={handleDropZoneDragLeave}
                on:drop={event => handleDropZoneDragDrop(event)}
                id="fileDropZone">
                FILE DROP ZONE
            </div>
        </div>
        <ul class="m-10" id="fileList"></ul>

        


</div>



<style lang="scss">
 

    .save-message {
        position: fixed;
        background-color: var(--accent-color);
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        z-index: 11;
    }
    .highlight{
        opacity: 0.5;
    }
    .drop-zone {
        border: 2px dashed var(--accent-color);
        --tw-bg-opacity: 0.5;
        background-color: hsl(var(--s) / var(--tw-bg-opacity));
        padding: 30px;
        text-align: center;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .toolbox-container{
        z-index: 10;
        position: relative;
    }

    .line {
        --tw-bg-opacity: 0.5;
        background-color: hsl(var(--p) / var(--tw-bg-opacity));
    }

    .custom-blockquote {
        min-height: 30px;
        --tw-bg-opacity: 0.5;
        background-color: hsl(var(--s) / var(--tw-bg-opacity));
        border-left: 4px solid hsl(var(--s)/ var(--tw-bg-opacity));
    }

    .custom-link {
        min-width: 50px;
        text-decoration: underline;
    }

    [contenteditable] {
        outline: 0px solid transparent;
    }

    .heading1 {
        font-size: 54px;
    }

    .heading2 {
        font-size: 36px;
    }

    .heading3 {
        font-size: 24px;
    }

    .bold {
        font-weight: bold;
    }

    .italic {
        font-style: italic;
    }

    .alignleft {
        text-align: left;
    }

    .aligncenter {
        text-align: center;
    }

    .alignright {
        text-align: right;
    }

    .uderline {
        text-decoration: underline;
    }

    .black{
        color: black;
    }
    .white{
        color: white;
    }
    .grey{
        color: grey;
    }
    .red{
        color: red;
    }
    .blue{
        color: blue;
    }
    .yellow{
        color: yellow;
    }
    .violet{
        color: violet;
    }
    .orange{
        color: orange;
    }
    .green{
        color: green;
    }
    
    .primary{
        color: theme("colors.primary");
    }

    .secondary{
        color: theme("colors.secondary");
    }


</style>