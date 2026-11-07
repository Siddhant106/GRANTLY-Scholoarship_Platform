const { createClient } = require('redis');

// Initialize Redis Client with Cloud Public Endpoint Configuration
const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD, 
  socket: {
    host: 'cast-unruffled-brass-82799.db.redis.io',
    port: 14605
  }
});

client.on('error', (err) => {
  console.warn('⚠️ Redis Client Error:', err.message);
});

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log('🚀 Redis Connected Successfully to Cloud Endpoint!');
  } catch (error) {
    console.warn('⚠️ Redis connection failed. Continuing without cache:', error.message);
  }
};

module.exports = { client, connectRedis };