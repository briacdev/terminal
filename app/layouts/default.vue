<template>
  <div class="site-shell relative min-h-screen bg-black text-zinc-100">
    <div class="relative z-10">
      <SiteHeader />
      <main class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>
