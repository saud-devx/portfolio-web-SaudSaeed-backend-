require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const expRoutes = require('./routes/experiences');
const projRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/uploads');
const msgRoutes = require('./routes/messages');
const settingsRoutes = require('./routes/settings');

const app = express();
connectDB();

// Allow frontend (local + deployed)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://portfolio-web-saud-saeed.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "admin-password"],
    credentials: true
  })
);

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// serve uploaded static files
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'public/uploads')));

// normal routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/experiences', expRoutes);
app.use('/api/v1/projects', projRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/messages', msgRoutes);
app.use('/api/v1/settings', settingsRoutes);

// admin routes
app.use('/api/v1/admin/experiences', require('./routes/admin/experiences'));
app.use('/api/v1/admin/projects', require('./routes/admin/projects'));
app.use('/api/v1/admin/settings', require('./routes/admin/settings'));
app.use('/api/v1/admin/uploads', require('./routes/admin/uploads'));

// health
app.get('/api/v1/health', (req, res) =>
  res.json({ ok: true, time: new Date() })
);

// error handler
app.use(errorHandler);
app.options("*", cors());

// download resume code


app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/api/download/resume', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'Saud-Saeed-Resume.pdf');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Saud-Saeed-Resume.pdf"');

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending resume:', err);
      if (!res.headersSent) res.status(500).send('Could not download the file.');
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
