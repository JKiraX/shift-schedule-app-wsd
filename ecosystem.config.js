module.exports = {
    apps: [
      {
        name: 'shift-scheduler',
        script: './server/index.js', // Path to your main server file
        watch: true,
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  