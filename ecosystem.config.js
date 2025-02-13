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
        APP_PORT: 9999,
        POSTGRESQL_USERNAME: 'root',
        POSTGRESQL_PASSWORD: 'secret',
        POSTGRESQL_HOST: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_NAME: 'learn-devops',
      },
      env_staging: {
        NODE_ENV: 'staging',
        APP_PORT: 9999,
        POSTGRESQL_USERNAME: 'root',
        POSTGRESQL_PASSWORD: 'secret',
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

      // --- Others---
      time: true, // Show time on the console
    },
  ],
  deploy: {
    development: {
      user: 'thangl-vietis', // Tên user SSH để deploy.
      host: ['34.124.149.226'], // Địa chỉ IP hoặc hostname server.
      ref: 'origin/main', // Branch Git để deploy.
      repo: 'git@github.com:skydark3004/training-devops-be.git', // Repository Git.
      path: '/home/thangl-vietis/deploy-pm2', // Thư mục trên server.
      'pre-deploy-local': "echo 'Deploying to production server'", // Script chạy trên máy local trước khi deploy.
      'post-deploy': 'bash post-deploy.sh', // Script chạy trên server sau khi deploy.
      'pre-setup': "echo 'Running pre-setup tasks'", // Script chạy trên server trước khi thiết lập.
    },
  },
};
