import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './User.css';

const User: React.FC = () => {
  const { user, logout } = useUserContext();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/get-users?page=${currentPage}&limit=${limit}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }

          const data = await response.json();

          if (data.users) {
            setUsers(data.users);
          } else {
            throw new Error('Unexpected data format');
          }

          setTotalPages(Math.ceil(data.total / limit));
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [user, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user) {
        const response = await fetch('http://localhost:3000/api/v1/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error('Failed to add user');
        }

        const addedUser = await response.json();

        setUsers((prev) => [...prev, addedUser]);
        setNewUser({ name: '', email: '', phone: '' });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="not-logged-in-container">
        <h1>You are not logged in</h1>
        <button className="login-button" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Welcome, {user.name}</h1>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="add-user-form">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={newUser.phone}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add User</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="users-list">
        <h2>Users List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <span>
                  {user.name} - {user.email}
                </span>
                <button onClick={() => navigate(`/user/${user.id}`)}>
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
