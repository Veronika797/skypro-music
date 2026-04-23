module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/src/app/music/main',
        permanent: true,
      },
    ];
  },
};
