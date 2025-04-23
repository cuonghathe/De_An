import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import RecipeDetails from './pages/Recipe/Recipe';
import CreateRecipe from './pages/Create_recipe/create_recipe';
import SearchResults from './components/searchResult';
import AdminPanel from './pages/Admin/Adminpanel';
import AdminTemplate from './components/admin_template';
import UserTemplate from './components/user_template';
import UserList from './pages/Admin/Userlist/userlist';
import AdminRecipeDetails from './pages/Admin/admin_recipe';
import AdminSearchResults from './components/admin_searchResult';
import UserProfile from './pages/User_profile/userProfile';
import UpdateProfile from './pages/User_profile/updateUser';
import UpdateRecipe from './pages/Create_recipe/update_recipe';
import TopRecipe from './pages/Leaderboard/TopRecipe';
import TopUser from './pages/Leaderboard/TopUser';
import UserProfilePublic from './pages/User_profile/userProfilePublic';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.isAdmin ? children : <Navigate to="/" />;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserTemplate />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="Recipe/:id" element={<RecipeDetails />} />
          <Route path="Recipe/Create" element={<CreateRecipe />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="userprofile/:userId" element={<UserProfile />} />
          <Route path="updateprofile/:userId" element={<UpdateProfile />} />
          <Route path="updaterecipe/:recipeid" element={<UpdateRecipe />} />
          <Route path="recipes/leaderboard" element={<TopRecipe />} />
          <Route path="users/leaderboard" element={<TopUser />} />
          <Route path="UserProfilePublic/:userId" element={<UserProfilePublic />} />
        </Route>


        <Route path="/admin" element={<PrivateRoute><AdminTemplate /></PrivateRoute>}>
          <Route index element={<AdminPanel />} />
          <Route path="User/Manage" element={<UserList />} />
          <Route path="Recipe/:id" element={<AdminRecipeDetails />} />
          <Route path="Recipe/Create" element={<CreateRecipe />} />
          <Route path="Home" index element={<Dashboard />} />
          <Route path="admin/search" element={<AdminSearchResults />} />
          <Route path="/admin/userprofile/:userId" element={<UserProfile />} />
          <Route path="updaterecipe/:recipeid" element={<UpdateRecipe />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
