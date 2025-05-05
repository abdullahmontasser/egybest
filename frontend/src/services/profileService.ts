const API_URL = 'http://localhost:5001/api';

export interface ProfileResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Get user profile
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch profile'
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Update profile preferences
export const updateProfilePreferences = async (preferences: any): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ preferences }),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update profile'
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Get favorites
export const getFavorites = async (): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/profile/favorites`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch favorites'
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Add to favorites
export const addToFavorites = async (movie: { movieId: string, title: string, poster: string }): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/profile/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(movie),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to add to favorites'
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Remove from favorites
export const removeFromFavorites = async (movieId: string): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/profile/favorites/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to remove from favorites'
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
