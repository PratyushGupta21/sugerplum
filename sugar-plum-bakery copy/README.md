# Sugar Plum Bakery 🍰

A complete full-stack e-commerce application for a bakery business, featuring online ordering, payment processing, and order management.

## 🏗️ Project Structure

```
sugar-plum-bakery/
├── frontend/              # Client-side application
│   ├── index.html        # Main HTML entry point
│   ├── pages/            # Page components
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript modules
│   └── assets/           # Images, fonts, icons
├── backend/               # Server-side API
│   ├── server.js         # Express server
│   ├── config/           # Configuration files
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── contracts/             # Documentation & contracts
│   ├── api/              # API documentation
│   ├── legal/            # Legal documents
│   ├── smart-contracts/  # Blockchain contracts
│   ├── schema/           # Database schema
│   └── docs/             # Architecture docs
├── README.md             # This file
├── .gitignore           # Git ignore rules
└── package.json         # Root package.json
```

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Single Page Application**: Dynamic page loading without full refreshes
- **Shopping Cart**: Persistent cart with localStorage
- **Payment Processing**: Secure form validation and processing
- **Product Catalog**: Grid layout with product cards and filtering

### Backend
- **RESTful API**: Complete CRUD operations for products, orders, and users
- **Authentication**: JWT-based user authentication and authorization
- **Order Management**: Full order lifecycle from creation to delivery
- **Email Notifications**: Automated order confirmations
- **Error Handling**: Comprehensive error handling and logging

### Additional Features
- **API Documentation**: Complete Swagger/OpenAPI specification
- **Postman Collection**: Pre-built collection for API testing
- **Legal Compliance**: Terms of service, privacy policy, and refund policy
- **Smart Contracts**: Solidity contracts for cryptocurrency payments
- **Database Schema**: Complete SQL schema with relationships

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- CSS Custom Properties (Variables)
- Local Storage API
- Fetch API for HTTP requests

### Backend
- Node.js & Express.js
- MongoDB/MySQL Database
- JWT Authentication
- bcrypt Password Hashing
- Nodemailer for Emails

### Development Tools
- Git Version Control
- npm Package Management
- Postman API Testing
- Swagger Documentation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB or MySQL database
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sugar-plum-bakery
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database Setup
```bash
# For MySQL: Import the schema
mysql -u username -p database_name < contracts/schema/db-schema.sql

# For MongoDB: The application will create collections automatically
```

### 5. Start the Application
```bash
# Start backend server
cd backend
npm run dev

# In another terminal, start frontend (if using a dev server)
# The frontend can be served statically or with a simple HTTP server
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs

## 📖 API Documentation

The API is fully documented using OpenAPI/Swagger. Access the documentation at:
- Swagger UI: http://localhost:5000/api/docs
- Postman Collection: Import `contracts/api/postman_collection.json`

### Key Endpoints

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (Admin)

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)

#### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

## 🎨 Design System

### Color Palette
- **Rose Pink**: #FFB6C1 (Primary)
- **Cream**: #FFFDD0 (Background)
- **Plum**: #8B4513 (Text)
- **Gold**: #FFD700 (Accents)

### Typography
- Primary Font: System font stack
- Headings: Bold, Plum color
- Body Text: Regular weight

### Components
- Navigation bar with cart indicator
- Product cards with hover effects
- Responsive grid layouts
- Form validation with error states

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting (recommended)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# API testing with Postman
# Import the collection from contracts/api/postman_collection.json
```

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production (if using a build tool)
npm run build

# Serve static files with nginx/apache or deploy to CDN
```

### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "sugar-plum-bakery"
```

### Database Deployment
- Use MongoDB Atlas for cloud database
- Use AWS RDS or similar for MySQL
- Configure connection strings in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@sugarplumbakery.com or create an issue in the repository.

## 🙏 Acknowledgments

- Icons from [Icon Library]
- Images from [Image Source]
- Color palette inspired by traditional bakery themes

---

**Sugar Plum Bakery** - Bringing joy through baked goods since 2020 🍪🥧