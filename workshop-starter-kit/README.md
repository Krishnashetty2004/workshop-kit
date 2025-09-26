# Workshop Starter Kit

A complete workshop creation and management platform with AI-powered content generation, Stripe payments, and automated email notifications.

## 🚀 Features

- **AI-Powered Workshop Generation** - Create professional workshops with a single prompt
- **Stripe Payment Integration** - Secure checkout and payment processing
- **Automated Email System** - Confirmation emails and reminders
- **Workshop Management** - Full CRUD operations for workshops
- **Attendee Tracking** - Registration and payment status management
- **Analytics Dashboard** - Revenue and attendance insights
- **Responsive Design** - Works on all devices

## 📁 Project Structure

```
workshop-starter-kit/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── db.js               # Database setup and helpers
│   ├── routes/             # API route handlers
│   │   ├── checkout.js     # Stripe checkout routes
│   │   ├── webhook.js      # Stripe webhook handlers
│   │   └── email.js        # Email service routes
│   ├── models/             # Data models
│   │   └── Attendee.js     # Attendee model
│   └── package.json        # Backend dependencies
│
├── frontend/               # Next.js frontend application
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/              # Shared utilities
│   ├── types/            # TypeScript definitions
│   ├── pages/            # Additional pages
│   │   ├── success.js    # Payment success page
│   │   └── cancel.js     # Payment cancel page
│   └── package.json      # Frontend dependencies
│
└── README.md             # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account
- Email service (Gmail, SendGrid, etc.)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd workshop-starter-kit/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd workshop-starter-kit/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhooks for payment events:
   - Endpoint: `http://localhost:3001/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### Email Setup

#### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use your Gmail address and App Password in the `.env` file

#### Other Email Services
Update the `EMAIL_SERVICE` and authentication details in your `.env` file.

## 📚 API Documentation

### Backend Endpoints

#### Workshop Management
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops/:id/publish` - Publish workshop
- `GET /api/workshops/:id/attendees` - Get workshop attendees

#### Payment Processing
- `POST /api/checkout/create-checkout-session` - Create Stripe checkout session
- `GET /api/checkout/session/:sessionId` - Get checkout session status
- `POST /api/webhooks/stripe` - Stripe webhook handler

#### Email Services
- `POST /api/email/send-reminders/:workshopId` - Send reminder emails
- `POST /api/email/send-cancellation/:workshopId` - Send cancellation emails
- `POST /api/email/test-email` - Send test email

#### Analytics
- `GET /api/analytics/overview` - Get analytics overview

### Frontend Pages

- `/` - Home page with workshop creation
- `/success` - Payment success page
- `/cancel` - Payment cancellation page
- `/dashboard` - Workshop management dashboard

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Variables:**
   Set all required environment variables in your deployment platform

2. **Database:**
   The SQLite database will be created automatically. For production, consider using PostgreSQL.

3. **Stripe Webhooks:**
   Update webhook endpoints to your production URLs

### Frontend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel, Netlify, or your preferred platform**

3. **Update API URLs:**
   Set `NEXT_PUBLIC_API_URL` to your backend URL

## 📊 Database Schema

### Workshops Table
- `id` - Primary key
- `title` - Workshop title
- `description` - Workshop description
- `instructor_name` - Instructor name
- `instructor_bio` - Instructor biography
- `date`, `time`, `duration` - Workshop timing
- `price`, `currency` - Pricing information
- `max_attendees` - Capacity limit
- `category`, `skills` - Workshop categorization
- `agenda`, `testimonials`, `faq` - JSON content
- `theme` - Styling information
- `status` - Workshop status (draft/published)

### Attendees Table
- `id` - Primary key
- `workshop_id` - Foreign key to workshops
- `name`, `email` - Attendee information
- `payment_status` - Payment status
- `payment_id` - Stripe payment ID
- `registered_at` - Registration timestamp

### Payments Table
- `id` - Primary key
- `workshop_id`, `attendee_id` - Foreign keys
- `stripe_payment_intent_id` - Stripe payment intent
- `amount`, `currency` - Payment details
- `status` - Payment status

## 🔒 Security Considerations

- **API Keys:** Store all API keys in environment variables
- **CORS:** Configure CORS properly for production
- **Input Validation:** All inputs are validated and sanitized
- **SQL Injection:** Using parameterized queries
- **Rate Limiting:** Consider implementing rate limiting for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Roadmap

- [ ] User authentication and authorization
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced email templates
- [ ] Workshop recording integration
- [ ] Social media integration
- [ ] Advanced payment options

---

**Built with ❤️ using Next.js, Express.js, Stripe, and modern web technologies.**
