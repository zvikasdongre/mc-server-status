<script>
  import { page } from '$app/stores';
  import logo from './mcstatus-logo.svg';
</script>

<header class="flex p-8 sm:pr-16 justify-between">
  <div class=" flex w-12 h-12">
    <a href="/">
      <img src={logo} alt="MC Status's Logo" />
    </a>
  </div>

  <div class="flex flex-row gap-4 text-lg items-center">
    <a
      class:text-purple-500={$page.url.pathname === '/'}
      sveltekit:prefetch
      class="w-fit inline"
      href="/">Home</a
    >
    <a
      class:text-purple-500={$page.url.pathname === '/about'}
      sveltekit:prefetch
      class="w-fit inline"
      href="/about">About</a
    >
  </div>
</header>
