import { useAuth } from "components/auth/provider";

export default function StudentHome() {
  const [auth] = useAuth();

  return (
    <div class="grid place-items-center h-full">
      <p class="text-lg">欢迎回来，{auth()?.name}</p>
    </div>
  );
}
