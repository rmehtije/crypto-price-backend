# Crypto Price Tracker (Backend)

This is the backend component for a cryptocurrency price tracking application, developed as a test assignment for a Senior FullStack Developer position.

## 🔗 Project Links
- **Project url**: [Link to railway app](https://crypto-price-frontend-production.up.railway.app/)
- **Frontend Repository**: [Link to frontend repository](https://github.com/rmehtije/crypto-price-frontend)

## 📋 Overview

This backend service provides real-time cryptocurrency price data through a RESTful API. It serves as the data layer for the frontend application, allowing users to view current cryptocurrency prices for specific pairs.

## 🛠️ Technologies & Packages

### Core Framework
- **Fastify** (^4.24.3) - High-performance web framework for Node.js

### Key Dependencies
- **@fastify/caching** (^8.4.0) - Caching support for Fastify
- **@prisma/client** (^6.15.0) - Type-safe database client

### External API
- **CoinMarketCap API** - Cryptocurrency price data source

### Testing
- **Jest** - Testing framework

### Deployment & Containerization
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container application management

## 🚀 Installation & Local Development

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your configurations:
   ```env
   DATABASE_URL="your_database_connection_string"
   COINMARKETCAP_API_KEY="your_coinmarketcap_api_key"
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development environment**
   ```bash
   docker-compose up -d --build
   ```

5. **Set up the database**
   ```bash
   yarn run db
   ```

## 🧪 Running Tests

Execute the test suite with the following command while docker is running:

```bash
yarn test
```

## 🤔 Technology Choices

I selected Fastify as the primary framework for several reasons:

1. **Performance**: Fastify is one of the fastest web frameworks for Node.js, offering low overhead and high throughput
2. **TypeScript Support**: Excellent native TypeScript support which enhances development experience and code quality
3. **Modern Architecture**: While Express.js is still widely used, Fastify offers a more modern approach with better performance and developer experience
4. **Team Alignment**: The technology stack was chosen to align with the existing team's expertise and preferences
5. **Ecosystem**: Fastify has a rich plugin ecosystem that simplifies implementing common features like caching, validation, and more

## 🔮 Future Enhancements

While this project currently focuses on fetching cryptocurrency pair prices, several enhancements could be implemented:


1. **Historical Data** - Add endpoints for historical price data and charts
2. **WebSocket Support** - Real-time price updates
3. **Multiple Exchange Support** - Aggregate prices from various exchanges
4. **Advanced Caching** - Redis integration for distributed caching
5. **Monitoring** - Add health checks and performance monitoring

## 📞 Support

For questions or issues regarding this backend service, please open an issue in the repository.