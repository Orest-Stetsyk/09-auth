'use client';

import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from '../ProfilePage.module.css';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const formAction = async (formData: FormData) => {
    const newUsername = String(
      formData.get('username') ?? ''
    ).trim();

    if (!newUsername) {
      setError('Username is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const updatedUser = await updateMe({
        username: newUsername,
      });

      setUser(updatedUser);

      router.push('/profile');
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Failed to update profile'
        );
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>
          Edit Profile
        </h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={`${user.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form
          className={css.profileInfo}
          action={formAction}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor="username">
              Username:
            </label>

            <input
              id="username"
              type="text"
              name="username"
              className={css.input}
              defaultValue={user.username}
              minLength={2}
              maxLength={32}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className={css.error} role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}