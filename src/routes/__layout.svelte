<script>
  import Header from '$lib/header/Header.svelte';
  import { webVitals } from '$lib/vitals';
  import { browser } from '$app/env';
  import { page } from '$app/stores';
  import '../app.css';

  let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

  if (browser && analyticsId) {
    page.subscribe(({ url, params }) =>
      webVitals({
        path: url.pathname,
        params,
        analyticsId
      })
    );
  }

  let current_year = new Date().getFullYear();
</script>

<svelte:head>
  <title>MC Status</title>
  <meta name="application-name" content="MC Status" />
  <meta name="description" content="Check Status of minecraft server, instantly!" />
  <meta name="author" content="Vikas Dongre" />
  <meta
    name="keywords"
    content="Minecraft, Server, Status, Checker, server-status, minecraft-server-status"
  />
</svelte:head>

<Header />

<main class="py-20 px-4 flex justify-center flex-col sm:px-16 md:m-auto md:w-full lg:w-3/4">
  <slot />
</main>

<footer class="py-6 w-full flex items-center flex-col  mt-10">
  <p class="font-bold">
    Made with ❤️ by <a
      href="http://github.com/zvikasdongre/"
      target="_blank"
      rel="noreferrer"
      class="underline text-purple-500">Vikas Dongre</a
    >
  </p>
  <p class="">
    &copy; Vikas Dongre {current_year}
  </p>
</footer>
