import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative ${
              feedType === "forYou" ? "text-blue-500" : "text-white"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500"></div>
            )}
          </div>
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative ${
              feedType === "following" ? "text-blue-500" : "text-white"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500"></div>
            )}
          </div>
        </div>

        {/* CREATE POST INPUT */}
        <div className="p-4 border-b border-gray-700">
          <CreatePost />
        </div>

        {/* POSTS */}
        <div className="p-4">
          <Posts feedType={feedType} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
