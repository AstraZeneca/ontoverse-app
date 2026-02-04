![Maturity level-0](https://img.shields.io/badge/Maturity%20Level-ML--0-red)

# Ontoverse

Ontoverse is a prototype application for exploring and visualizing scientific papers and their relationships through an interactive graph interface. The application provides a unified platform for navigating research papers, topics, and their connections using a Neo4j graph database.

## Description

Ontoverse is a Next.js-based web application that combines frontend and backend functionality into a single unified framework. It allows users to:

- Explore scientific papers and their relationships
- Navigate topic hierarchies through interactive graph visualizations
- Filter and search papers by various criteria
- View detailed information about papers and topics

The application uses D3.js for graph visualization and Material-UI for the user interface, providing an intuitive way to explore complex research relationships.

## Software Requirements

### Supported Platforms

- **Operating System**: Linux, macOS, Windows
- **Node.js**: Version 18 or higher
- **Package Manager**: npm or yarn

### Required Dependencies

- **Neo4j Database**: A running Neo4j instance (version 4.0 or higher recommended)
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or yarn equivalent)

### Optional Dependencies

- Docker (for containerized deployment)
- nginx (for production deployment)

## How to Use / Run the Code

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd odsp-ontoverse
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Configure your Neo4j database connection in `.env.local`:
```env
DB_SCHEME=neo4j
DB_HOST=localhost
DB_PORT=7687
DB_USERNAME=neo4j
DB_PASSWORD=your-password
DB_DATABASE=neo4j
CONFIG_ID=MEDIUM
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Docker Deployment

Build the Docker image:

```bash
docker build -t ontoverse:latest .
```

Run the container:

```bash
docker run -p 80:80 --env-file .env.local ontoverse:latest
```

See `DOCKER_TEST.md` for more detailed Docker instructions.

## Project Structure

- `app/` - Next.js app directory (pages, layouts, API routes)
- `components/` - React components
- `lib/` - Shared utilities and libraries
  - `neo4j/` - Neo4j database utilities
  - `papers/` - Paper data models and adapters
  - `utils/` - Utility functions
  - `state/` - State management
- `model/` - Data models and types
- `public/` - Static assets

## API Routes

- `/api/papers` - GET endpoint to fetch papers data from Neo4j

## Environment Variables

- `DB_SCHEME` - Neo4j connection scheme (neo4j, neo4j+s, neo4j+ssc)
- `DB_HOST` - Neo4j host address
- `DB_PORT` - Neo4j port (default: 7687)
- `DB_USERNAME` - Neo4j username
- `DB_PASSWORD` - Neo4j password
- `DB_DATABASE` - Neo4j database name
- `CONFIG_ID` - Application configuration ID (SMALL, MEDIUM). Default: MEDIUM

## Migration from Separate Frontend/Backend

This project has been migrated from a separate NestJS backend and React frontend to a unified Next.js application. See `MIGRATION_SUMMARY.md` for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Authors

See [AUTHORS.md](AUTHORS.md) for the list of authors and maintainers.
