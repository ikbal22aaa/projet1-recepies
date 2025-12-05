# 🍳 Recipe App - Hybrid Setup Guide

## 🚀 Live Server + PHP Server Setup

This guide shows you how to run your recipe app with Live Server for frontend development and PHP server for API calls.

### 📋 Prerequisites
- ✅ Live Server extension installed in VS Code/Cursor
- ✅ PHP server running (port 8000)
- ✅ MySQL database running

### 🔧 Setup Steps

#### 1. Start PHP Server (Terminal)
```bash
# In your project directory
php -S localhost:8000 -t .
```

#### 2. Start Live Server (VS Code/Cursor)
- Right-click on `index.html`
- Select "Open with Live Server"
- Usually opens on `http://127.0.0.1:5500` or similar

#### 3. Configure API URLs
The app is already configured to use:
- **Frontend**: Live Server (auto-refresh)
- **Backend**: PHP server on `http://localhost:8000`

### 🎯 How It Works

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Live Server   │ ──────────────► │   PHP Server    │
│  (Frontend)     │                 │   (Backend)     │
│  Port 5500      │                 │   Port 8000     │
└─────────────────┘                 └─────────────────┘
```

### 🔄 Switching Environments

Edit `api-config.js` to change environments:

```javascript
// For Live Server + PHP server
const CURRENT_ENV = 'development';

// For XAMPP Apache
const CURRENT_ENV = 'xampp';

// For production
const CURRENT_ENV = 'production';
```

### ✅ Testing

1. **Frontend**: Open Live Server URL
2. **API**: Check browser console for API calls
3. **Database**: Verify recipes load and can be added

### 🐛 Troubleshooting

**API calls failing?**
- Check PHP server is running: `http://localhost:8000/get_recipes.php`
- Check browser console for CORS errors
- Verify database connection

**Live Server not refreshing?**
- Check Live Server extension is active
- Try restarting Live Server
- Check file permissions

### 🎉 Benefits

- ⚡ **Instant refresh** with Live Server
- 🔧 **Full API functionality** with PHP server
- 🎨 **Perfect for development** with hot reloading
- 📱 **Mobile testing** with Live Server's network access

---

**Happy coding!** 🚀✨
