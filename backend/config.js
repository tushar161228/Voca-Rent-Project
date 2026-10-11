require("dotenv").config();

const config = {
    database: {
        dbConnectionString: process.env.MONGODB_CONNECTION_STRING
    },
    http: {
        port: process.env.PORT || 80,
    },
    pagination: {
        limit: 10,
        maxLimit: 500
    },
    jwtSecret: process.env.JWT_SECRET || 'your_super_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    wordpress: {
        baseUrl: "https://image.devloperhemant.com",
        username: "admin",
        appPassword: process.env.WORDPRESS_APP_PASSWORD,
    },

    subscriptionTiers: {
        basic: {
            price: 1,
            maxTenants: 10,
            whatsappAlerts: 0,
            ivrCalls: 0,
            features: ["Manual rent tracking", "Transaction history", "Basic analytics"]
        },
        standard: {
            price: 99,
            maxTenants: 20,
            whatsappAlerts: 10,
            ivrCalls: 5,
            features: ["Payment reminders", "Advanced analytics"]
        },
        premium: {
            price: 249,
            maxTenants: 50,
            whatsappAlerts: 30,
            ivrCalls: 15,
            features: ["Automated reminders", "Premium analytics", "Priority support"]
        },
        enterprise: {
            price: 499,
            maxTenants: 100,
            whatsappAlerts: -1,
            ivrCalls: -1,
            features: ["Unlimited WhatsApp", "Full automation", "24/7 support", "Custom integrations"]
        }
    },
    reminderSettings: {
        startBeforeDays: 3,
        schedule: [
            { day: -3, alerts: 2, ivrCalls: 0 },
            { day: -2, alerts: 3, ivrCalls: 0 },
            { day: -1, alerts: 4, ivrCalls: 2 }
        ]
    }
};

module.exports = config;
