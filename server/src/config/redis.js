const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL 
});

client.on('error', (err) => {
  // Silent or log warning instead of crashing the server
  console.warn('⚠️ Redis Client Warning: Server is running without Redis caching active.');
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('🚀 Redis Connected Successfully');
  } catch (error) {
    console.warn('⚠️ Redis connection failed. Continuing without cache.');
  }
};

module.exports = { client, connectRedis };