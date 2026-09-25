const mongoose = require('mongoose');
const dns = require('dns');

// Force public DNS resolution to fix SRV lookup failures on mobile hotspots / different Wi-Fi networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if DNS setting fails
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed admin user if not existing
    const { seedAdmin } = require('../controllers/authController');
    await seedAdmin();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
