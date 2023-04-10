import { Title } from "components/title";
import { FiFileText } from "solid-icons/fi";
import { ExamSelect } from "./exam-select";
import { ScoreTable } from "./table";

export function Page() {
  return (
    <div class="space-y-8 px-12 pt-8">
      <Title icon={FiFileText}>历次成绩</Title>
      <ExamSelect />
      <ScoreTable />
    </div>
  );
}
