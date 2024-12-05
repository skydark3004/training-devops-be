module.exports = {
  apps: [
    {
      name: 'back-end',
      script: './dist/main.js',
      instances: '2', // default 1
      exec_mode: 'cluster', // mode to start your app, can be “cluster” or “fork”, default fork

      // --- ENV ---
      // default pm2 get environment variables from options env if you don't specify env options
      env: {
        NODE_ENV: 'development',
        APP_PORT: 3000,
        POSTGRESQL_USERNAME: 'postgres',
        POSTGRESQL_PASSWORD: 'postgres',
        POSTGRESQL_HOST: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_NAME: 'learn-devops',
        LOGGING_QUERY_SQL: true,
      },
      env_staging: {
        NODE_ENV: 'staging',
        APP_PORT: 3000,
        POSTGRESQL_USERNAME: 'postgres',
        POSTGRESQL_PASSWORD: 'postgres',
        POSTGRESQL_HOST: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_NAME: 'learn-devops',
        LOGGING_QUERY_SQL: true,
      },

      watch: false, // watch change file
      ignore_watch: ['node_modules', 'logs'],

      // --- Log ---
      output: './logs/out.log',
      error: './logs/error.log',
      log_type: 'json',
      merge_logs: true, // Merge logs from all instances
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      log_file: './logs/combined.log', // file path for both output and error logs (disabled by default)

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

      // --- Khác ---
      time: true, // Show time on the console
    },
  ],

  deploy: {
    development: {
      key: '~/.ssh/id_ed25519', // path to the public key to authenticate
      user: 'thangl-vietis', // user to ssh
      host: ['35.186.157.126'],
      ref: 'origin/new', // Branch Git để deploy.
      repo: 'git@github.com:skydark3004/training-devops-be.git', // Repository Git.
      path: '/home/thangl-vietis/back-end', // Thư mục trên server.
      'pre-deploy-local': "echo 'Deploying to development server'", // Script chạy trên máy local trước khi deploy.
      'post-deploy': 'pm2 reload ecosystem.config.js --env development', // Script chạy trên server sau khi deploy.
      'pre-setup': 'npm install && npm run build', // Script chạy trên server trước khi thiết lập.
    },
  },
};
