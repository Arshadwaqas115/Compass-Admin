export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    detail : '/dashboard/add-user',
    user_agent_list: '/dashboard/user-agent-list',
    overview: '/dashboard'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
