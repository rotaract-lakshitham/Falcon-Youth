const express  = require('express');
const dotenv   = require('dotenv');
const cors     = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/events',      require('./routes/eventRoutes'));
app.use('/api/newsletters', require('./routes/newsletterRoutes'));
app.use('/api/council',     require('./routes/councilRoutes'));
app.use('/api/directory',   require('./routes/directoryRoutes'));
app.use('/api/projects',    require('./routes/projectRoutes'));
app.use('/api/contact',     require('./routes/contactRoutes'));
// app.use('/api/stats',       require('./routes/statsRoutes'));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: '🦅 Falcon Youth API is running' }));

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
