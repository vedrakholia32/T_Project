import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 md:w-60 md:h-screen md:relative md:flex md:flex-col md:justify-between">
      <ul className="flex flex-col gap-5 mb-5 md:mb-0">
        <li className="flex items-center py-2 px-4 hover:bg-stone-400 transition-all rounded-full duration-300">
          <Link to="/" className="flex items-center gap-3">
            <MdHomeFilled className="w-6 h-6" />
            <span className="hidden md:inline text-lg">Home</span>
          </Link>
        </li>

        <li className="flex items-center py-2 px-4 hover:bg-stone-400 transition-all rounded-full duration-300">
          <Link to="/notifications" className="flex items-center gap-3">
            <IoNotifications className="w-6 h-6" />
            <span className="hidden md:inline text-lg">Notifications</span>
          </Link>
        </li>

        <li className="flex items-center py-2 px-4 hover:bg-stone-400 transition-all rounded-full duration-300">
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex items-center gap-3"
          >
            <FaUser className="w-6 h-6" />
            <span className="hidden md:inline text-lg">Profile</span>
          </Link>
        </li>
      </ul>

      {authUser && (
        <div className="flex items-center gap-3 p-4 md:p-6 justify-center md:justify-start md:mt-auto rounded-md shadow-md h-16 mt-2">
          <BiLogOut
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="w-5 h-5 mb-5 cursor-pointer ml-auto md:ml-0"
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
