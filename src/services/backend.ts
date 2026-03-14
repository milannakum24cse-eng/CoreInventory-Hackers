export interface SignupRequest {
  loginId: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  error?: string;
  data?: T;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const signupViaBackend = async (data: SignupRequest): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Signup failed',
        error: result.error,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const signinViaBackend = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Sign in failed',
        error: result.error,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
