<script lang="ts">
    // export let data
    // let { supabase } = data
    // $: ({ supabase } = data)
    //
    // let email
    // let password


import {csharp} from "svelte-highlight/languages";
    import {Highlight} from "svelte-highlight";
    import "svelte-highlight/styles/github.css";

</script>

<main class="items-center">
    <form action="?/login" method="POST" class="auth-form">
        <div>

        <div class="card mx-auto p-4 md:p-8 lg:p-20 lg:card-side md:w-3/4 xl:w-2/3 bg-base-100 md:shadow-xl">
            <div class="text-center my-10 w-1/2 mx-auto">
                <h1 class="text-4xl md:text-3xl lg:text-5xl">
                    <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone">Design.</span>
                </h1>

                <h1 class="text-5xl md:text-5xl lg:text-7xl">
                    <span class="bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-transparent box-decoration-clone">Code.</span>
                </h1>
                <h1 class="text-4xl md:text-5xl lg:text-7xl">
                    <span class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">Build.</span>
                </h1>
                <h1 class="text-4xl md:text-5xl lg:text-7xl">
                    <span class="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent box-decoration-clone">Deploy.</span>
                </h1>

            </div>

            <div class="divider divider-vertical lg:divider-horizontal"></div>

            <div class="card-body mx-auto">
                <h2 class="card-title text-3xl opacity-80 text-primary">Login</h2>
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">E-Mail-Adresse</span>
                    </label>
                    <input type="text" placeholder="Type here" name="email" class="input input-bordered" value="neer@infoboard.biz" />
                </div>
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">Passwort</span>
                    </label>
                    <input type="password" name="password" placeholder="Password" value="1234#abc" class="input input-bordered" />
                </div>
                <div class="card-actions justify-center mt-3">
                    <button type="submit" class="btn btn-primary px-10">Anmelden</button>
                </div>

            </div>



        </div>
                <div class="mt-10 text-center mx-auto">
                    <Highlight language={csharp} wrapLines={true} code={"Console.WriteLine('Willkommen bei infoBoard ✌️');"} />
                </div>
            </div>
    </form>
</main>

<style lang="scss">


</style>