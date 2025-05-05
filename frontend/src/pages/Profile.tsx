import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as profileService from '../services/profileService';
import '../css/Auth.css';

interface ProfileData {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  favoriteMovies: any[];
  watchHistory: any[];
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    } else {
      fetchProfile();
    }
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      setError('An error occurred while loading your profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="auth-container">Loading profile data...</div>;
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-error">{error}</div>
        <button className="auth-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="auth-container">Loading...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>My Profile</h2>
        <p>Manage your account</p>
      </div>

      {profile && (
        <>
          <div className="profile-info">
            <div className="profile-field">
              <label>Username</label>
              <p>{user.username}</p>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="profile-field">
              <label>Account ID</label>
              <p>{user.id}</p>
            </div>

            <div className="profile-field">
              <label>Favorites</label>
              <p>{profile.favoriteMovies.length} movies</p>
            </div>

            <div className="profile-field">
              <label>Theme Preference</label>
              <p>{profile.preferences.theme}</p>
            </div>
          </div>

          <button
            className="auth-button"
            onClick={handleLogout}
            style={{ marginTop: '2rem' }}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;

// Add this CSS to Auth.css if needed
//
// .profile-info {
//   margin: 1.5rem 0;
// }
//
// .profile-field {
//   margin-bottom: 1rem;
// }
//
// .profile-field label {
//   font-weight: 500;
//   display: block;
//   margin-bottom: 0.25rem;
//   color: var(--text-secondary);
// }
//
// .profile-field p {
//   margin: 0;
//   padding: 0.5rem;
//   background-color: var(--input-bg);
//   border-radius: 4px;
// }
