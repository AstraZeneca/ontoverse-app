// Neo4j-specific types - raw database driver structures

export type LowHigh = { low: number; high: number };

export type RawCollectionDbProps = {
  collectionID: string | number;
  collectionName: string;
  graphLevel?: LowHigh;
  authors?: string | string[];
  year?: LowHigh;
};

export type RawItemDbProps = {
  abstract?: string;
  authors?: string | string[];
  all_authors?: string[];
  collectionTags?: string[];
  cui_list?: string[];
  date?: string;
  doi?: string;
  isbn?: string;
  issue?: string;
  itemID?: LowHigh;
  journal?: string;
  journal_abbreviation?: string;
  keywords?: string[];
  meshTerms?: string[];
  mesh_terms?: string[];
  pages?: string;
  pmid?: string;
  publication_title?: string;
  similarPapers?: string[];
  similarItems?: string[];
  title?: string;
  skos__prefLabel?: string;
  url?: string;
  volume?: string;
  pubmedID?: LowHigh;
  year?: LowHigh;
  nodeID?: string;
  graphLevel?: LowHigh;
  edgeWeight?: LowHigh;
  [key: string]: unknown;
};

export interface RawNode {
  identity: LowHigh;
  labels: string[];
  properties: RawCollectionDbProps | RawItemDbProps;
}

export interface RawRelationship {
  identity: LowHigh;
  start: LowHigh;
  end: LowHigh;
  type: string;
  properties: {
    edgeWeight?: LowHigh;
  };
}

export type Field = {
  identity: LowHigh;
  labels: string[];
  properties: RawCollectionDbProps | RawItemDbProps;
};

export type DBRecord = {
  keys: string[];
  length: number;
  _fieldLookup: {
    collections: number;
    p: number;
  };
  _fields: Field[];
};
