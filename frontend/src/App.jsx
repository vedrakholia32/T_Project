import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
// import { CiLogin } from "react-icons/ci";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

function App() {
  const { data:authUser, isLoading } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if(data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false
  });

  if(isLoading){
    return(
      <div className="h-screen flex justify-center item-center">
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  // console.log(authUser)

  // console.log("authUser is here:", data)
  return (
    <div className=" flex max-w-6xl mx-auto">
      {/* {Common components bc it's not wrapped with Routes} */}
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login"/>} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes>
      {authUser &&  <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;