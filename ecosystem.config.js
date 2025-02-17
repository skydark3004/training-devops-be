module.exports = {
  apps: [
    {
      name: 'back-end',
      script: './dist/main.js',
      instances: '2', // default 1
      exec_mode: 'cluster', // mode to start your app, can be “cluster” or “fork”, default fork

      // --- ENV ---
      // default pm2 get environment variables from options env if you don't specify env options
      env_development: {
        NODE_ENV: 'development',
        APP_PORT: 8888,
        POSTGRESQL_USERNAME: 'root',
        POSTGRESQL_PASSWORD: 'secret',
        POSTGRESQL_HOST: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_NAME: 'learn-devops',
        SECURE_JWT_SECRET_KEY: 'secret-key',
        //PM2_ENV_FILE: '/home/thangl-vietis/deploy-pm2/.env-development',
      },
      env_staging: {
        PM2_ENV_FILE: '/home/thangl-vietis/deploy-pm2/.env-staging',
      },

      watch: false, // watch change file
      ignore_watch: ['node_modules', 'logs'],

      // --- Log ---
      output: './logs/out.json',
      error: './logs/error.json',
      log_type: 'json',
      merge_logs: true, // Merge logs from all instances
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      log_file: './logs/combined.json', // file path for both output and error logs (disabled by default)

      // --- Resources ---
      max_memory_restart: '500M', // memory specified
      pid_file: './logs/app.pid', // Save PID of application.

      // --- Restart ---
      autorestart: true, // true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
      restart_delay: 5000, // Time to wait before restart
      min_uptime: '60s', // min time of application run to be considered started successfully
      max_restarts: 5, // max restarts until stop application when error

      // --- Control Flow ---
      //cron_restart: "0 0 * * *", // Cronjob restart application
      shutdown_with_message: true, // shutdown an application with process.send(‘shutdown’) instead of process.kill(pid, SIGINT)

      // --- Others---
      time: true, // Show time on the console
    },
  ],
  deploy: {
    development: {
      user: 'thangl-vietis', // user to ssh
      host: ['34.124.149.226'], // IP server.
      ref: 'origin/main', // Branch Git to deploy
      repo: 'git@github.com:skydark3004/training-devops-be.git', // Repository Git.
      path: '/home/thangl-vietis/deploy-pm2', // directory to folder pm2 deploy
      'pre-deploy-local': "echo 'Deploying to development server...'",
      'post-deploy': `sh deploy.sh development`,
    },
    staging: {
      user: 'thangl-vietis', // user to ssh
      host: ['34.124.149.226'], // IP server.
      ref: 'origin/main', // Branch Git to deploy
      repo: 'git@github.com:skydark3004/training-devops-be.git', // Repository Git.
      path: '/home/thangl-vietis/deploy-pm2', // directory to folder pm2 deploy
      'pre-deploy-local': "echo 'Deploying to development server...'",
      'post-deploy': `sh deploy.sh staging`,
    },
  },
};
