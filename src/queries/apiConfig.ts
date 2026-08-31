export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  routes: {
    garmin: {
      session: '/garmin-session',
      authenticate: '/authenticate-garmin',
      authenticateMfa: '/authenticate-garmin-mfa',
    },
  },
} as const;
