import "./App.css";
import Layout from "./components/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Posts from './pages/Posts'
import CreatePost from "./pages/CreatePost";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import UserPage from "./pages/UserPage";
import UserProfileView from './pages/UserProfileView';
import PostView from "./pages/PostView";
import MessagePage from "./pages/MessagePage";

function App() {
  return (
    <>
      <Router>
        <ToastContainer /> {/* ✅ Add ToastContainer */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/show-post" element={<Posts/>} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/user-profile-view/:userId" element={<UserProfileView />} />
            <Route path="/post-view/:postId" element={<PostView/>}/>
            <Route path='/message-page/:userId' element={<MessagePage/>}/>
            {/* Add more routes as needed */}
            {/* <Route path="/:id" element={<PostDetails />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
