'use client';

import React from 'react';
import './form.css';
import FormContent from './form-content';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';

import { useTranslations } from 'next-intl';

type SubmitValues = {
  email: string;
  password: string;
};

const SignInForm: React.FC = () => {
  const { signIn } = useAuth();
  const t = useTranslations('AuthForm');

  const handleSignIn = async (userData: SubmitValues) => {
    const toastId = toast.loading(t('signingIn'));
    try {
      await signIn(userData.email, userData.password);
      toast.success(t('welcomeBack', { email: userData.email }), { id: toastId });
      // successToast('Signing in user:' + JSON.stringify(userData));
    } catch (error) {
      const errorMessage = (error as Error)?.message;

      toast.error(errorMessage, {
        id: toastId,
      });
      throw error; // Пробрасываем ошибку дальше
    }
  };

  return (
    <div className={'wrapper'}>
      <FormContent onSignIn={handleSignIn} />
    </div>
  );
};

export default SignInForm;
