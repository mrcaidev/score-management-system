import { useAuth } from "components/auth/provider";
import { FiLogOut } from "solid-icons/fi";
import toast from "solid-toast";

export function Logout() {
  const [, { refetch }] = useAuth();

  const handleClick = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await refetch();
    toast.success("已安全退出");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      class="flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 text-sm"
    >
      <FiLogOut size={16} />
      退出
    </button>
  );
}
