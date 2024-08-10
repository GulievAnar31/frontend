import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { UserProvider, useUserContext } from '../../context/UserContext';
import Login from '../Login/Login';
import User from '../User/User';
import Register from '../Register/Register';
import UserDetails from '../User/UserDetails/UserDetails';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useUserContext();
  return user ? element : <Navigate to="/register" />;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<PrivateRoute element={<User />} />} />
          <Route path="*" element={<Navigate to="/register" />} />{' '}
          {/* Перенаправление на страницу регистрации для всех других маршрутов */}
          <Route path="/user/:id" element={<UserDetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
