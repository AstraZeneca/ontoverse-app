// Domain types - business entities (database-agnostic)

export type ItemProps = {
  abstract: string;
  authors: string;
  all_authors: string[];
  collectionTags: string[];
  cui_list: string[];
  date: string;
  doi: string;
  isbn: string;
  issue: string;
  itemID: number;
  journal: string;
  journal_abbreviation: string;
  keywords: string[];
  meshTerms: string[];
  pages: string;
  pmid: string;
  publication_title: string;
  similarItems: string[];
  title: string;
  url: string;
  volume: string;
  pubmedID: number;
  year: number;
  nodeID: string;
};

export type CollectionProps = {
  collectionID: string | number;
  collectionName: string;
};
