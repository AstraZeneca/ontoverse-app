export type Neo4jScheme = 'neo4j' | 'neo4j+s' | 'neo4j+ssc';

export interface Neo4jConfig {
  scheme: Neo4jScheme;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database: string;
}

export function getNeo4jConfig(): Neo4jConfig {
  const config: Neo4jConfig = {
    scheme: (process.env.DB_SCHEME as Neo4jScheme) || 'neo4j',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '7687',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
  };

  if (
    !config.scheme ||
    !config.host ||
    !config.port ||
    !config.username ||
    !config.password ||
    !config.database
  ) {
    throw new Error('Missing required Neo4j configuration values');
  }

  return config;
}

