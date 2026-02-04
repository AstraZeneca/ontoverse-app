import neo4j, { Driver } from 'neo4j-driver';
import { Neo4jConfig, getNeo4jConfig } from './neo4j-config';

let driver: Driver | null = null;

export async function getNeo4jDriver(): Promise<Driver> {
  if (driver) {
    return driver;
  }

  const config = getNeo4jConfig();
  
  // Only enable debug logging in development
  const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'warn';
  
  driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
    {
      logging: {
        level: logLevel,
        logger: (level, message) => {
          console[level].call(console, `${level.toUpperCase()} ${message}`);
        },
      },
    }
  );

  await driver.verifyConnectivity();
  return driver;
}

export async function getReadSession(database?: string) {
  const driver = await getNeo4jDriver();
  const config = getNeo4jConfig();
  return driver.session({
    database: database || config.database,
    defaultAccessMode: neo4j.session.READ,
  });
}

export async function getWriteSession(database?: string) {
  const driver = await getNeo4jDriver();
  const config = getNeo4jConfig();
  return driver.session({
    database: database || config.database,
    defaultAccessMode: neo4j.session.WRITE,
  });
}

export async function readCypher(cypher: string, params: Record<string, any>, database?: string) {
  const session = await getReadSession(database);
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

export async function writeCypher(cypher: string, params: Record<string, any>, database?: string) {
  const session = await getWriteSession(database);
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

