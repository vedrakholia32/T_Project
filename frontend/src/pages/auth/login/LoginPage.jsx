import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen w-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col p-6 bg-gray-800 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded-lg flex items-center gap-2 bg-gray-700 text-white">
            <MdOutlineMail className="text-xl m-2" />
            <input
              type="text"
              className="grow p-2 outline-none bg-gray-800 text-white"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded-lg flex items-center gap-2 bg-gray-700 text-white mt-2">
            <MdPassword className="text-xl m-2" />
            <input
              type="password"
              className="grow p-2 outline-none bg-gray-800 text-white"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          <button
            type="submit"
            className={`btn rounded-full bg-blue-600 text-white p-2 ${isLoading ? "loading" : ""}`}
          >
            Login
          </button>

          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full bg-transparent border border-white text-white p-2 w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
