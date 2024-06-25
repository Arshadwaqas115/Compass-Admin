'use client';

import type { User } from '@/types/user';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';


export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { email, password } = params;
    try {
      
      const { user } = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem('custom-auth-token', token);

      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    const { user } = await signInWithEmailAndPassword(auth as Auth, email, password);
    const token = await user.getIdToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
    
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data: User | null; error?: string }> {

    const token = localStorage.getItem('custom-auth-token');
    if (!token) {
      return { data: null };
    }
    const user = auth.currentUser
    const activeUser: User = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      accessToken: await user?.getIdToken(),
    };

    return { data: activeUser };
  }
  

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
