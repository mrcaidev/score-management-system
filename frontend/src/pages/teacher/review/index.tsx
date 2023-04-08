import { PageTitle } from "components/page-title";
import { FiSearch } from "solid-icons/fi";
import { ReviewTable } from "./table";

export default function TeacherReview() {
  return (
    <div class="space-y-8 px-12 pt-8">
      <PageTitle>
        <FiSearch />
        查分审核
      </PageTitle>
      <ReviewTable />
    </div>
  );
}
