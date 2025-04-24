# Mandi Mart Backend API

Backend server for the Mandi Mart agricultural e-commerce platform, providing APIs for user authentication, crop pricing, and market data.

## Features

-   🔐 **Authentication**: JWT-based user authentication system
-   👥 **Role-based Access**: Support for users, buyers, and admin roles
-   📊 **Crop Price Analytics**: Real-time market price data
-   📧 **Email Services**: OTP-based password reset system
-   🔍 **Search APIs**: Location and commodity-based search

## Tech Stack

-   Node.js & Express
-   MongoDB with Mongoose
-   JWT Authentication
-   Brevo Email Service
-   CORS enabled

## Prerequisites

-   Node.js 18+
-   MongoDB
-   npm or yarn

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email Service (Brevo)
MAIL_API=your_brevo_api_key
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Piyushrathoree/TeamOptimizers-backend.git
cd TeamOptimizers-backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - User login
-   `POST /api/auth/forgot-password` - Request password reset
-   `POST /api/auth/reset-password` - Reset password with OTP
-   `POST /api/auth/change-password` - Change password (authenticated)

### Crop Price Endpoints

-   `GET /api/crops/commodity/:commodity` - Get prices by commodity
-   `GET /api/crops/search?state=&district=` - Search by location

## Project Structure

```
TeamOptimizers-backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── .env                 # Environment variables
└── index.js            # Entry point
```

## Error Handling

The API uses standard HTTP status codes:

-   200: Success
-   201: Created
-   400: Bad Request
-   401: Unauthorized
-   403: Forbidden
-   404: Not Found
-   500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

## Related Projects

-   [Frontend Repository](https://github.com/shivampatel0048/team-optimizer)
