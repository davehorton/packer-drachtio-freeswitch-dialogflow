module.exports = {
  apps : [{
    name: 'dialogflow-phone-gateway',
    cwd: '/home/admin/drachtio-dialogflow-phone-gateway',
    script: 'app.js',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    max_restarts: 100,
    restart_delay: 500,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]  
};