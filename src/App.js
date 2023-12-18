// import Counter from "./features/counter/Counter";

import AddPostForm from "./posts/AddPostForm";
import PostsList from "./posts/PostLists";
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/Layout";
import SinglePostPage from "./posts/SinglePostPage";
import EditPostForm from "./posts/EditPostForm";
import UserList from "./posts/user/UserList";
import UserPage from "./posts/user/UserPage";
function App() {
  return (
    // <main className="App">

    //    <AddPostForm/>
    //  <PostsList/>
    //  </main> 
    <Routes>
      <Route path="/" element={<Layout />}
      >
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />


        </Route>
        <Route path="user">
          <Route index element={<UserList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;