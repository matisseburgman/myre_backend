const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const recipesRoutes = require('./recipesRoutes')
const authRoutes = require('./routes/authRoutes')
const path = require('path')

// Load environment variables
// In production (Railway), use environment variables directly
// In development, use config files
if (process.env.NODE_ENV !== 'production') {
    const configPath = path.join(__dirname, 'config.local.env')
    const fallbackPath = path.join(__dirname, 'config.env')
    require('dotenv').config({ path: require('fs').existsSync(configPath) ? configPath : fallbackPath })
}

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Use routes
app.use(recipesRoutes)
app.use('/auth', authRoutes)

// Test route
app.get('/test', (req, res) => {
    res.json({ message: "API is working!" })
})

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    })
})

// Debug logging
console.log('Attempting to connect to MongoDB...')
console.log('ATLAS_URI:', process.env.ATLAS_URI ? 'Defined' : 'Undefined')
console.log('PORT:', process.env.PORT || 'Using default (3000)')

// MongoDB connection with specific database
if (process.env.ATLAS_URI) {
    mongoose.connect(process.env.ATLAS_URI, {
        dbName: 'recipesData',
        serverSelectionTimeoutMS: 30000
    })
    .then(() => {
        console.log('Successfully connected to MongoDB.')
        console.log('Database name:', mongoose.connection.name)
        console.log('Database host:', mongoose.connection.host)
        
        // Start server ALLEEN na database connectie
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`)
            console.log(`Test endpoint: http://localhost:${PORT}/test`)
            console.log(`Health check: http://localhost:${PORT}/health`)
        })
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    })
} else {
    console.error('ATLAS_URI not found in environment variables!')
    process.exit(1)
}
