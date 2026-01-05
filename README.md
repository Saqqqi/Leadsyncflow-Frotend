# Lead Sync Flow

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Axios-1.6+-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</div>

## 🚀 Overview

Lead Sync Flow is a modern, responsive web application built with React and TypeScript that provides a comprehensive lead management system. The application features a beautiful UI with authentication, role-based access control, and seamless user experience.

## ✨ Features

- 🔐 **Complete Authentication System**
  - User registration and login
  - Token-based authentication
  - Role-based access control
  - Protected routes

- 🎨 **Modern UI/UX**
  - Responsive design with TailwindCSS
  - Beautiful gradient themes
  - Smooth animations and transitions
  - Dark/light mode support

- 🛡️ **Security**
  - JWT token management
  - Protected API endpoints
  - Input validation
  - Error handling

- 📱 **Cross-Platform**
  - Mobile-responsive design
  - Progressive Web App ready
  - Optimized performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/leadsyncflow-frotend.git
   cd leadsyncflow-frotend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoints
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/           # API services and axios configuration
├── auth/          # Authentication components
├── components/    # Reusable UI components
├── layout/        # Layout components
├── pages/         # Page components
│   ├── auth/      # Authentication pages
│   └── superAdmin/ # Admin pages
├── routes/        # Route protection and navigation
└── assets/        # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Lead Sync Flow
```

### Vercel Deployment
The project includes `vercel.json` for proper SPA routing on Vercel:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. **Registration**: Users can create accounts with department selection
2. **Login**: Secure authentication with JWT tokens
3. **Protected Routes**: Role-based access to different sections
4. **Token Management**: Automatic token refresh and storage

## 🎨 UI Components

- **Login Page**: Modern gradient design with form validation
- **Signup Page**: Comprehensive registration with department selection
- **Dashboard**: Main application interface
- **Navigation**: Responsive sidebar and header

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-username/leadsyncflow-frotend/issues) page
2. Create a new issue with detailed information
3. Join our Discord community (link coming soon)

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

<div align="center">
  <p>Made with ❤️ by the Lead Sync Flow Team</p>
</div>
