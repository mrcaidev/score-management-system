import { useRouteData } from "@solidjs/router";
import { useAuth } from "components/auth/provider";
import { Select } from "components/forms/select";
import { NormalLoading } from "components/loading";
import { examsData } from "pages/exams.data";
import { FiFileText } from "solid-icons/fi";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import toast from "solid-toast";
import { request } from "utils/request";
import { NamedScore } from "utils/types";

export default function StudentScore() {
  const [auth] = useAuth();

  const exams = useRouteData<typeof examsData>();

  const [examId, setExamId] = createSignal(exams()?.at(0)?.id ?? "");

  const [namedScores] = createResource(examId, (examId) => {
    const params = new URLSearchParams();

    const studentId = auth()?.id;
    if (studentId) {
      params.append("studentId", studentId);
    }

    if (examId) {
      params.append("examId", examId);
    } else {
      return [];
    }

    return request.get<NamedScore[]>(`/scores?${params.toString()}`);
  });

  createEffect(() => {
    if (namedScores.error) {
      toast.error(namedScores.error.message);
    }
  });

  return (
    <div class="space-y-8 px-12 pt-8">
      <h1 class="flex items-center gap-3 font-bold text-3xl">
        <FiFileText />
        历次成绩
      </h1>
      <Select
        id="exam"
        label="考试"
        name="exam"
        onChange={(e) => setExamId(e.currentTarget.value)}
        class="max-w-md"
      >
        <Show when={exams()}>
          <For each={exams()}>
            {(exam) => (
              <option value={exam.id} selected={examId() === exam.id}>
                {exam.name}
              </option>
            )}
          </For>
        </Show>
      </Select>
      <Switch>
        <Match when={namedScores.loading}>
          <div class="grid place-items-center h-40">
            <NormalLoading />
          </div>
        </Match>
        <Match when={namedScores.error}>
          <div>发生错误：{namedScores.error.message}</div>
        </Match>
        <Match when={namedScores()}>
          <table class="w-full max-w-3xl text-center">
            <colgroup>
              <col span={1} class="w-1/4" />
              <col span={1} class="w-1/2" />
              <col span={1} class="w-1/4" />
            </colgroup>
            <thead>
              <tr class="bg-gray-300 dark:gray-700">
                <th class="py-3 border border-gray-400 dark:border-gray-600">
                  科目
                </th>
                <th class="py-3 border border-gray-400 dark:border-gray-600">
                  成绩
                </th>
                <th class="py-3 border border-gray-400 dark:border-gray-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={namedScores()}>
                {(score) => (
                  <tr class="hover:bg-gray-200 dark:hover:gray-800 transition-colors">
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      {score.courseName}
                    </td>
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      {score.score}
                    </td>
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() =>
                          request.post(`/scores/${score.id}/require-review`, {})
                        }
                        class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-sm text-gray-100 transition-colors"
                      >
                        查分
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Match>
      </Switch>
    </div>
  );
}
