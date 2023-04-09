import { Title } from "components/title";
import { FiSearch } from "solid-icons/fi";
import { Table } from "./table";

export function Page() {
  return (
    <div class="space-y-8 px-12 pt-8">
      <Title>
        <FiSearch />
        查分审核
      </Title>
      <Table />
    </div>
  );
}
