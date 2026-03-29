// config/env.js - Environment variable validation and loading

const requiredEnvVars = [
    'DB_URI',
    'JWT_SECRET',
    'PORT'
];

const optionalEnvVars = [
    'NODE_ENV',
    'FRONTEND_URL',
    'PAYMENT_KEY',
    'EMAIL_USER',
    'EMAIL_PASS'
];

function validateEnvironment() {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(envVar => console.error(`   - ${envVar}`));
        console.error('\nPlease check your .env file or environment configuration.');
        process.exit(1);
    }

    // Log optional missing vars as warnings
    const missingOptional = optionalEnvVars.filter(envVar => !process.env[envVar]);
    if (missingOptional.length > 0) {
        console.warn('⚠️  Missing optional environment variables:');
        missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
    }

    console.log('✅ Environment variables validated successfully');
}

// Validate environment on module load
validateEnvironment();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    PAYMENT_KEY: process.env.PAYMENT_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
};