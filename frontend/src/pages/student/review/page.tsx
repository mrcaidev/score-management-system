import { useRouteData } from "@solidjs/router";
import { Title } from "components/title";
import { reviewsData } from "pages/reviews.data";
import { FiSearch } from "solid-icons/fi";
import { Show } from "solid-js";
import { CreateButton } from "./create-button";
import { ReviewTable } from "./table";

export function Page() {
  const [scores, { mutate }] = useRouteData<typeof reviewsData>();

  return (
    <div class="space-y-8 px-12 pt-8">
      <Title>
        <FiSearch />
        查分申请
      </Title>
      <CreateButton mutate={mutate} />
      <Show when={scores().length} fallback={<p>暂无查分申请</p>}>
        <ReviewTable scores={scores()} mutate={mutate} />
      </Show>
    </div>
  );
}
