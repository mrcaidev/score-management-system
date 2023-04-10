import { Title } from "components/title";
import { FiBookOpen } from "solid-icons/fi";
import { Table } from "./table";
import { CreateButton } from "./create-button";

export function Page() {
  return (
    <div class="space-y-8 px-12 pt-8">
      <Title>
        <FiBookOpen />
        考试管理
      </Title>
      <CreateButton />
      <Table />
    </div>
  );
}
