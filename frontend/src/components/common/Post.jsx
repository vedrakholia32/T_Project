import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/date/index.js";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authUser._id }), // Pass userId if needed
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data; // Expect updated likes array
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes }; // Update with new likes array
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const postOwner = post.user;
  const isLiked = post.likes?.includes(authUser?._id);
  const isMyPost = authUser._id === post.user._id;

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 h-8 rounded-full overflow-hidden"
        >
          <img
            className="w-8 h-8 rounded-full"
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
      </div>
      <div className="text-slate-300 flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-500 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting ? (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              ) : (
                <LoadingSpinner size="sm" />
              )}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="Post"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => setIsModalOpen(true)}
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            <dialog
              open={isModalOpen}
              className="bg-slate-700 p-3 w-50 modal border-none outline-none rounded"
            >
              <div className="modal-box border-none">
                <h3 className="text-slate-200 font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  ) : (
                    post.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex gap-2 items-start"
                      >
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={comment.user.profileImg || "/avatar-placeholder.png"}
                              alt="Commenter's profile"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className=" text-white font-semibold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-300 text-sm">
                              @{comment.user.username}
                            </span>
                            <span className="text-gray-500">
                              {formattedDate}
                            </span>
                          </div>
                          <div className="text-white text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="bg-slate-500 text-white textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog">
                <button
                  type="button"
                  className="btn btn-circle btn-sm text-white absolute top-3 right-3 bg-transparent border-none hover:bg-slate-600 focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </form>
            </dialog>
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={handleLikePost}
            >
              <FaRegHeart
                className={`w-4 h-4 text-slate-500 group-hover:text-red-400 ${isLiked ? "text-red-500" : ""}`}
              />
              <span className="text-sm text-slate-500 group-hover:text-red-400">
                {post.likes.length}
              </span>
            </div>
            <div className="flex gap-1 items-center cursor-pointer group">
              <BiRepost className="w-4 h-4 text-slate-500 group-hover:text-green-400" />
              <span className="text-sm text-slate-500 group-hover:text-green-400">
                {post.reposts}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaRegBookmark className="w-5 h-5 text-slate-500 cursor-pointer hover:text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
