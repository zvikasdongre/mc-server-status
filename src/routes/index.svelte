<script context="module">
  export const prerender = true;
</script>

<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let address = '';
  let valid_address = false;
  let type = 'java';
  let status;

  function getStatus(address, type) {
    if (!valid_address) {
      return Promise.resolve({
        error: 'No IP address provided or the IP address is invalid.'
      });
    } else {
      return fetch(`/status?address=${address}&type=${type}`).then((res) => res.json());
    }
  }

  function validate_address(address) {
    if (address.trim() === '') {
      return false;
    }
    return true;
  }
</script>

<svelte:head>
  <title>MC Status</title>
  <meta name="application-name" content="MC Status" />
  <meta name="description" content="Check Status of minecraft server, instantly!" />
</svelte:head>

<div class="flex sm:flex-row flex-col gap-6">
  <section class="flex-1">
    <h1
      class="text-6xl font-bold mb-5 text-[calc(2rem_+_2.7vw)] lg:text-6xl text-center sm:text-left"
    >
      MC Status
    </h1>

    <h2 class="text-2xl font-semibold mb-6">Check Status of minecraft server, instantly!</h2>

    <div
      class="bg-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row gap-4 shadow-md md:flex-nowrap flex-wrap"
    >
      <input
        type="text"
        bind:value={address}
        on:input={() => {
          valid_address = validate_address(address);
        }}
        placeholder="hypixel.net"
        class="block w-full text-sm border-zinc-600 bg-zinc-800 border text-zinc-300 focus:shadow-outline-zinc py-2 px-3 rounded-lg focus:ring-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring"
      />
      <select
        name="type"
        bind:value={type}
        class="block w-full text-sm text-zinc-300 border-zinc-600 bg-zinc-800 border focus:shadow-outline-purple focus:shadow-outline-zinc py-2 px-3 rounded-lg focus:ring-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring form-select"
      >
        <option value="java" selected>Java</option>
        <option value="bedrock">Bedrock / MCPE</option>
      </select>
      <button
        on:click={() => {
          status = getStatus(address, type);
        }}
        class="py-2 px-4 bg-purple-700 text-white rounded-lg transition shadow-md hover:shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-95"
        >Check</button
      >
    </div>
  </section>

  <aside class="flex-1 sm:max-w-md w-full">
    {#if status}
      <div
        class="p-8 bg-zinc-800 rounded-lg shadow-md"
        in:slide={{
          duration: 300,
          easing: quintOut
        }}
      >
        {#await status}
          <div
            class="flex items-center"
            in:slide={{
              duration: 300,
              easing: quintOut
            }}
          >
            <h2 class="font-bold">
              <span class="text-yellow-500">Fetching </span>
              Server Status...
            </h2>
            <div class="w-4 h-4 relative rounded-full ml-2">
              <div class="w-4 h-4 absolute rounded-full bg-yellow-500" />
              <div class="w-4 h-4 animate-ping absolute rounded-full bg-yellow-500" />
            </div>
          </div>
        {:then result}
          {#if result.online}
            <div
              class="flex items-center mb-4"
              in:slide={{
                duration: 300,
                easing: quintOut
              }}
            >
              {#if result.favicon}
                <div class="mr-8">
                  <img
                    src={result.favicon}
                    alt={`"${result.motd.clean}" Server Icon`}
                    class="w-16 h-16 bg-cover rounded-md"
                  />
                </div>
              {/if}
              <h2 class="font-bold">
                Server is
                <span class="text-green-500">Online</span>
              </h2>
              <div class="w-4 h-4 relative rounded-full ml-2">
                <div class="w-4 h-4 absolute rounded-full bg-green-600" />
                <div class="w-4 h-4 animate-ping absolute rounded-full bg-green-600" />
              </div>
            </div>
            <div class="mb-2">
              {@html result.motd.html}
            </div>
            <ul class="border border-zinc-600 rounded-lg p-4">
              <li>
                <span class="text-teal-500">Players Online:</span>
                <span class="text-purple-500 font-bold">{result.players.online}</span>
              </li>
              <li>
                <span class="text-teal-500">Max Players:</span>
                <span class="text-purple-500 font-bold">{result.players.max}</span>
              </li>
              <li>
                <span class="text-teal-500">Version: </span>
                <span class="text-purple-500 font-bold"
                  >{result.version.name} (Protocol: {result.version.protocol})</span
                >
              </li>
              {#if result.roundTripLatency}
                <li>
                  <span class="text-teal-500">Ping: </span>
                  <span
                    class="font-bold"
                    class:text-green-500={result.roundTripLatency <= 120}
                    class:text-yellow-500={result.roundTripLatency >= 120 &&
                      result.roundTripLatency <= 260}
                    class:text-orange-500={result.roundTripLatency >= 260 &&
                      result.roundTripLatency <= 320}
                    class:text-red-500={result.roundTripLatency >= 320}
                    >{result.roundTripLatency}ms</span
                  >
                  <span class="text-neutral-500 text-xs ml-2"
                    >Fetched From {result.edge_region}</span
                  >
                </li>
              {/if}
              {#if result.gameMode}
                <li>
                  <span class="text-teal-500">GameMode: </span>
                  <span class="text-purple-500 font-bold">{result.gameMode}</span>
                </li>
              {/if}
            </ul>
          {:else if result.error}
            <div
              class="flex"
              in:slide={{
                duration: 300,
                easing: quintOut
              }}
            >
              <h2 class="font-bold">
                <span class="text-red-500">An Error occured!</span>
              </h2>
            </div>
            <p class="text-sm text-zinc-500">
              {result.error}
            </p>
          {:else}
            <div
              class="flex"
              in:slide={{
                duration: 300,
                easing: quintOut
              }}
            >
              <h2 class="font-bold">
                Server is
                <span class="text-red-500">Offline</span>
              </h2>
              <div class="w-4 h-4 py-1 relative rounded-full ml-2">
                <div class="w-4 h-4 absolute rounded-full bg-red-600" />
                <div class="w-4 h-4 animate-ping absolute rounded-full bg-red-600" />
              </div>
            </div>
            <p class="text-sm text-zinc-500">
              The server is Offline or Currently Unreachable. Make sure you have written correct
              Address and choosen the right Server Type from the dropdown.
            </p>
          {/if}
        {/await}
      </div>
    {/if}
  </aside>
</div>
