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
  createResource,
  createSignal,
} from "solid-js";
import { handleRequestError, request } from "utils/request";
import { NamedScore } from "utils/types";

export default function StudentScore() {
  const [auth] = useAuth();

  const exams = useRouteData<typeof examsData>();

  const [selectedExamId, setSelectedExamId] = createSignal("");

  const [namedScores] = createResource(
    () => selectedExamId() || exams()?.at(0)?.id,
    (examId) =>
      request.get<NamedScore[]>("/scores", {
        params: {
          studentId: auth()?.id,
          examId,
        },
      })
  );

  const createClickReviewHandler = (scoreId: string) => {
    return async () => {
      try {
        await request.post(`/review/${scoreId}`);
      } catch (error) {
        handleRequestError(error);
      }
    };
  };

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
        onChange={(e) => setSelectedExamId(e.currentTarget.value)}
        class="max-w-md"
      >
        <Show when={exams()}>
          <For each={exams()}>
            {({ id, name }) => (
              <option value={id} selected={selectedExamId() === id}>
                {name}
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
                {({ id, courseName, score }) => (
                  <tr class="hover:bg-gray-200 dark:hover:gray-800 transition-colors">
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      {courseName}
                    </td>
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      {score}
                    </td>
                    <td class="py-2 border border-gray-400 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={createClickReviewHandler(id)}
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
