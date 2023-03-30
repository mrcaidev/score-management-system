import { FiLoader } from "solid-icons/fi";

export function PageLoading() {
  return (
    <div class="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
      <FiLoader size={36} class="animate-spin" />
    </div>
  );
}
