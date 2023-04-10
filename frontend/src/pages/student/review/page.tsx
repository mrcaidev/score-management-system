import { Title } from "components/title";
import { FiSearch } from "solid-icons/fi";
import { CreateButton } from "./create-button";
import { ReviewTable } from "./table";

export function Page() {
  return (
    <div class="space-y-8 px-12 pt-8">
      <Title icon={FiSearch}>查分申请</Title>
      <CreateButton />
      <ReviewTable />
    </div>
  );
}
