// Neo4j-specific types - raw database driver structures
import { PaperFieldProps, CollectionFieldProps } from '@/lib/papers/model/domain-types';

export type LowHigh = { low: number; high: number };

export interface RawNode {
  identity: LowHigh;
  labels: string[];
  properties: any;
}

export interface RawRelationship {
  identity: LowHigh;
  start: LowHigh;
  end: LowHigh;
  type: string;
  properties: {
    edgeWeight: LowHigh;
  }
}

export type Field = {
  identity: LowHigh;
  labels: string[];
  properties: CollectionFieldProps | PaperFieldProps;
}

export type DBRecord = {
  keys: string[];
  length: number;
  _fieldLookup: {
    collections: number;
    p: number;
  }
  _fields: Field[]
}

