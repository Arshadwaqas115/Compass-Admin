export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    agents:'/dashboard/agents',
    vendors:'/dashboard/hotelVendors',
    detail : '/dashboard/add-user',
    user_agent_list: '/dashboard/users',
    tranportVendors: '/dashboard/transportVendors',
    employes : '/dashboard/employes'

    // overview: '/dashboard'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
