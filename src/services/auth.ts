import { supabase } from '../lib/supabase';

export interface SignupData {
  loginId: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const signup = async (data: SignupData): Promise<SignupResponse> => {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          login_id: data.loginId,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: 'Signup failed',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
