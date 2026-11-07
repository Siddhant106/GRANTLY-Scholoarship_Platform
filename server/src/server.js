const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server after connecting to Database and Redis
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running smoothly on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();