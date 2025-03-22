import { isAuthenticatd } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticatd();

  if (isUserAuthenticated) redirect('/');

  return (
    <div className='auth-layout'>{ children }</div>
  )
}

export default AuthLayout