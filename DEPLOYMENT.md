# AI Home Energy Coach - Deployment Guide

## 🚀 Quick Start (Frontend Only)

The simplest way to run the application is to use the frontend-only version:

1. **Download/Clone** the repository
2. **Open** `index.html` in your web browser
3. **Start using** the AI Home Energy Coach!

This version includes mock AI functionality and works entirely in the browser.

## 🐍 Full Stack Development Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd ai-home-energy-coach
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask backend**
   ```bash
   python app.py
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - The application will be served by Flask

### Development Mode

For development with hot reloading:

```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## 🌐 Production Deployment

### Option 1: Static Hosting (Frontend Only)

For simple deployment without backend features:

1. **Upload files** to any static hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3
   - Firebase Hosting

2. **Configure** your hosting service to serve `index.html` as the default page

### Option 2: Full Stack Deployment

#### Heroku Deployment

1. **Create a Procfile**
   ```
   web: gunicorn app:app
   ```

2. **Add gunicorn to requirements.txt**
   ```
   gunicorn==20.1.0
   ```

3. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   EXPOSE 5000
   
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
   ```

2. **Build and run**
   ```bash
   docker build -t ai-energy-coach .
   docker run -p 5000:5000 ai-energy-coach
   ```

#### AWS/Google Cloud/Azure

1. **Use container services** (ECS, GKE, AKS)
2. **Deploy the Docker image** to your cloud platform
3. **Configure load balancers** and auto-scaling as needed

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
FLASK_ENV=development
FLASK_DEBUG=1
WEATHER_API_KEY=your_weather_api_key
ENERGY_API_KEY=your_energy_api_key
```

### API Keys (Future Implementation)

For production deployment, you'll need:

- **Weather API**: OpenWeatherMap, NOAA, or Dark Sky
- **Energy Data**: Utility company APIs
- **Building Data**: NYC OpenData or similar

## 📊 Monitoring and Analytics

### Health Checks

The application includes a health check endpoint:
```
GET /api/health
```

### Logging

Configure logging in production:

```python
import logging
logging.basicConfig(level=logging.INFO)
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Validate all user inputs
- [ ] Rate limiting on API endpoints
- [ ] Secure API keys and secrets
- [ ] Regular security updates

### CORS Configuration

For production, update CORS settings in `app.py`:

```python
CORS(app, origins=['https://yourdomain.com'])
```

## 🚀 Performance Optimization

### Frontend Optimization

1. **Minify CSS and JavaScript**
2. **Optimize images**
3. **Enable gzip compression**
4. **Use CDN for libraries**

### Backend Optimization

1. **Database caching** (Redis)
2. **API response caching**
3. **Load balancing**
4. **Database connection pooling**

## 📈 Scaling Considerations

### Horizontal Scaling

- **Load balancers** for multiple instances
- **Database clustering**
- **CDN for static assets**
- **Microservices architecture** for different features

### Vertical Scaling

- **Increase server resources**
- **Optimize database queries**
- **Implement caching strategies**

## 🔄 Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **Python dependencies not found**
   ```bash
   pip install -r requirements.txt --force-reinstall
   ```

3. **CORS errors**
   - Check CORS configuration in `app.py`
   - Verify frontend URL is in allowed origins

4. **Chart.js not loading**
   - Check internet connection
   - Verify CDN links in `index.html`

### Debug Mode

Enable debug mode for detailed error messages:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📞 Support

For deployment issues:

1. Check the logs for error messages
2. Verify all dependencies are installed
3. Ensure ports are not blocked by firewall
4. Check browser console for frontend errors

---

*This deployment guide covers the most common scenarios. For specific platform requirements, refer to the platform's official documentation.* 