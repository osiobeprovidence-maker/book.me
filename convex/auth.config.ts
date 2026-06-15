export default {
  providers: [
    {
      domain: import.meta.env.VITE_CONVEX_AUTH_DOMAIN || '',
      applicationID: 'convex',
    },
  ],
};
