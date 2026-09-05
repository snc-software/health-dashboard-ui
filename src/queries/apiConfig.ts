export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  routes: {
    garmin: {
      session: '/garmin-session',
      authenticate: '/authenticate-garmin',
      authenticateMfa: '/authenticate-garmin-mfa',
    },
    strava: {
      session: '/strava-session',
      authorize: '/authorize-strava',
    },
    healthStats: {
      daily: (startDate: string, endDate: string) =>
        `/start/${startDate}/end/${endDate}/health-stats`,
    },
  },
} as const;
