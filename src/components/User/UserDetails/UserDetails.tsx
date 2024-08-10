import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import '../User.css';

const UserDetails: React.FC = () => {
  const { user, logout } = useUserContext();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/get-user/${id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }

          const data = await response.json();
          setUserData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [user, id]);

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
    <div className="user-details-container">
      <div className="user-header">
        <h1>User Details</h1>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
        <br />
        <button className="logout-button" onClick={() => navigate('/user')}>
          Go back
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : userData ? (
        <div className="user-info">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetails;
