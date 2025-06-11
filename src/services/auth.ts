import { AuthType } from '@/types/auth';

export const signIn = async (formData: FormData): Promise<AuthType> => {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sign in form', error);
    throw error;
  }
};

export const signUp = async (formData: FormData): Promise<AuthType> => {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sign up form', error);
    throw error;
  }
};