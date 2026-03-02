![Ontoverse Logo](./public/ontoverse_logo.svg)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Maturity level-0](https://img.shields.io/badge/Maturity%20Level-ML--0-red)
[![arXiv](https://img.shields.io/badge/arXiv-2408.03339-b31b1b.svg)](https://arxiv.org/abs/2408.03339)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Neo4j](https://img.shields.io/badge/Neo4j-4.0+-008CC1?logo=neo4j)
![Material-UI](https://img.shields.io/badge/Material--UI-5-007FFF?logo=mui)
![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3.js)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)


**Ontoverse** is a knowledge management platform designed to visualize and explore scientific literature in an intuitive, cartographic manner. The system transforms bibliographic collections into interactive network visualizations where papers are connected based on conceptual similarity and topic occupancy, enabling researchers to discover relationships, identify research trends, and navigate related work within their domain.
The Ontoverse consists of the ontoverse-kg-choreographer, a knowledge graph generation pipeline which transforms bibliographic data into a rich, queryable knowledge graph architecture, and the ontoverse-app which enables the cartographic visualization. 

## Description

The purpose of Ontoverse is:

- **Visual Literature Exploration**: Transform large collections of scientific papers into navigable knowledge graphs where conceptual relationships are visually apparent
- **Concept-Based Discovery**: Connect papers through shared biomedical concepts (entities like diseases, genes, proteins, drugs) rather than simple keyword matching
- **Research Landscape Mapping**: Reveal the structure and topology of research domains, showing how different topics and papers relate to one another
- **Enhanced Literature Review**: Enable researchers to quickly identify related work, find papers on similar topics, and understand the conceptual landscape of their field

The Ontoverse app is a Next.js-based web application that combines frontend and backend functionality into a single unified framework.
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

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Authors

See [AUTHORS.md](AUTHORS.md) for the list of authors and maintainers.


## Citation

If you use the Ontoverse, please cite
@misc{zimmermann2024ontoversedemocratisingaccessknowledge,
      title={The Ontoverse: Democratising Access to Knowledge Graph-based Data Through a Cartographic Interface}, 
      author={Johannes Zimmermann and Dariusz Wiktorek and Thomas Meusburger and Miquel Monge-Dalmau and Antonio Fabregat and Alexander Jarasch and Günter Schmidt and Jorge S. Reis-Filho and T. Ian Simpson},
      year={2024},
      eprint={2408.03339},
      archivePrefix={arXiv},
      primaryClass={cs.HC},
      url={https://arxiv.org/abs/2408.03339}, 
}
