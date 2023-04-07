import { useAuth } from "components/auth/provider";
import { FiLogOut } from "solid-icons/fi";
import toast from "solid-toast";
import { removeLocalStorage } from "utils/storage";

export function Logout() {
  const [, { refetch }] = useAuth();

  const handleClick = async () => {
    removeLocalStorage("token");
    toast.success("已安全退出");
    await refetch();
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
