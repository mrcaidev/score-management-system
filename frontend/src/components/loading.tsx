import { Show, createEffect, createSignal, onCleanup } from "solid-js";

export function Loading() {
  const [shouldShow, setShouldShow] = createSignal(false);

  createEffect(() => {
    const timer = setTimeout(() => setShouldShow(true), 500);
    onCleanup(() => clearTimeout(timer));
  });

  return (
    <Show when={shouldShow()}>
      <div class="flex flex-col justify-center items-center fixed left-0 right-0 top-0 bottom-0">
        <div class="grid grid-cols-3 gap-0.5">
          <div class="w-10 h-10 rounded-sm bg-indigo-400 animate-flash animate-duration-2000 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-indigo-500 animate-flash animate-duration-2000 animate-delay-100 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-indigo-600 animate-flash animate-duration-2000 animate-delay-200 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-indigo-500 animate-flash animate-duration-2000 animate-delay-100 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-indigo-600 animate-flash animate-duration-2000 animate-delay-200 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-blue-600 animate-flash animate-duration-2000 animate-delay-300 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-indigo-600 animate-flash animate-duration-2000 animate-delay-200 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-blue-600 animate-flash animate-duration-2000 animate-delay-300 animate-count-infinite" />
          <div class="w-10 h-10 rounded-sm bg-blue-500 animate-flash animate-duration-2000 animate-delay-400 animate-count-infinite" />
        </div>
        <p class="mt-8 text-lg animate-pulse">加载中，请稍候</p>
      </div>
    </Show>
  );
}
