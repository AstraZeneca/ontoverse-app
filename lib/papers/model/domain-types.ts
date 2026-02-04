// Domain types - business entities (database-agnostic)
// These represent the domain model, not database structures

export type PaperFieldProps = {
  abstract: string;
  authors: string[] | string;
  collectionTags: string[];
  cui_list: string[];
  date: string;
  doi: string;
  isbn: string;
  issue: string;
  itemID: number; // Domain uses number, converted from LowHigh at DB boundary
  journal_abbreviation: string;
  keywords: string[];
  pages: string;
  pmid: string;
  publication_title: string;
  similarPapers: string[];
  title: string;
  volume: string;
}

export type CollectionFieldProps = {
  collectionID: number;
  collectionName: String;
  graphLevel: number; // Domain uses number, converted from LowHigh at DB boundary
}

