<script context="module">
  import { browser, dev } from '$app/env';

  // we don't need any JS on this page, though we'll load
  // it in dev so that we get hot module replacement...
  export const hydrate = dev;

  // ...but if the client-side router is already loaded
  // (i.e. we came here from elsewhere in the app), use it
  export const router = browser;

  // since there's no dynamic data here, we can prerender
  // it so that it gets served as a static asset in prod
  export const prerender = true;
</script>

<svelte:head>
  <title>About - MC Status</title>
  <meta name="description" content="About MC Status." />
</svelte:head>

<div class="content text-lg">
  <h1 class="text-2xl font-bold mb-4">About MC Status</h1>

  <p class="mb-2">
    This app is made to check the status of minecraft servers, You can check the server's status
    almost instantly and without any cache.
  </p>
  <p class="mb-2">
    This website is made by Vikas Dongre, I made this website to be used completely Free of charge.
    Enjoy :)
  </p>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }
</style>
