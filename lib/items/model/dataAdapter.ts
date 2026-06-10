import { LowHigh, RawNode, RawRelationship } from '@/lib/neo4j/neo4j-types';
import {
  APP_GROUP,
  CollectionNodeType,
  DB_LABEL,
  EdgeFromServer,
  GraphData,
  GraphNodeType,
  NodeKind,
} from '@/model/GraphDataModel';
import { ItemProps, CollectionProps } from './domain-types';
import { TreeNode } from './HierarchyPositioning';
import { brakeStringIntoLines, truncateItemAuthors } from './stringUtils';

export type { GraphData };

const lowToNumber = (v: LowHigh | number | undefined): number => {
  if (v === undefined || v === null) return 0;
  if (typeof v === 'number') return v;
  return v.low;
};

export const mapItemProps = (item: RawNode): ItemProps => {
  const p = item.properties as Record<string, unknown>;
  const authorsRaw = p.authors;
  const authors = Array.isArray(authorsRaw)
    ? authorsRaw.join(', ')
    : String(authorsRaw ?? '');
  const allAuthors = Array.isArray(p.all_authors)
    ? (p.all_authors as string[])
    : authors
      ? authors.split(',').map((s) => s.trim())
      : [];
  const date = (p.date as string) ?? '';
  const yearFromDate = date ? parseInt(date.substring(0, 4), 10) : 0;
  const similarRaw = (p.similarItems ?? p.similarPapers) as string[] | undefined;

  return {
    abstract: String(p.abstract ?? ''),
    authors,
    all_authors: allAuthors,
    collectionTags: (p.collectionTags as string[]) ?? [],
    cui_list: (p.cui_list as string[]) ?? [],
    date,
    doi: String(p.doi ?? ''),
    isbn: String(p.isbn ?? ''),
    issue: String(p.issue ?? ''),
    itemID:
      lowToNumber(p.itemID as LowHigh | number | undefined) || item.identity.low,
    journal: String(p.journal ?? ''),
    journal_abbreviation: String(p.journal_abbreviation ?? ''),
    keywords: (p.keywords as string[]) ?? [],
    meshTerms: (p.meshTerms as string[]) ?? (p.mesh_terms as string[]) ?? [],
    pages: String(p.pages ?? ''),
    pmid: String(p.pmid ?? ''),
    publication_title: String(p.publication_title ?? ''),
    similarItems: similarRaw ?? [],
    title: String(p.title ?? p.skos__prefLabel ?? ''),
    url: String(p.url ?? ''),
    volume: String(p.volume ?? ''),
    pubmedID:
      lowToNumber(p.pubmedID as LowHigh | undefined) ||
      parseInt(String(p.pmid ?? '0'), 10) ||
      0,
    year: lowToNumber(p.year as LowHigh | undefined) || yearFromDate || 0,
    nodeID: String(p.nodeID ?? ''),
  };
};

export const mapCollectionProps = (item: RawNode): CollectionProps => {
  const p = item.properties as Record<string, unknown>;
  return {
    collectionID: (p.collectionID as string | number) ?? '',
    collectionName: String(p.collectionName ?? ''),
  };
};

const convertToEdgeType = (item: RawRelationship): EdgeFromServer => {
  const weight = item.properties?.edgeWeight?.low ?? 1;
  return {
    id: item.identity.low,
    type: item.type as EdgeFromServer['type'],
    source: item.start.low,
    target: item.end.low,
    value: item.type === 'MEMBER_OF' ? 1 : 0.5,
    weight,
  };
};

const buildItemShell = (
  item: RawNode,
  typeNumber: NodeKind,
  props: ItemProps,
): GraphNodeType<ItemProps> => {
  const id = item.identity.low;
  const group =
    typeNumber === NodeKind.Clone ? APP_GROUP.Clone : APP_GROUP.Item;
  const title = props.title;
  const year = props.year ? String(props.year) : props.date?.substring(0, 4) ?? '';

  return {
    typeNumber,
    id,
    graphLevel: lowToNumber(
      (item.properties as { graphLevel?: LowHigh }).graphLevel,
    ) || -1,
    linkedNodeIds: [],
    color: typeNumber === NodeKind.Clone ? '#0000FF' : '#ff0000',
    group,
    title,
    titleInLines: brakeStringIntoLines(title || ''),
    year,
    label: props.authors ? truncateItemAuthors(props.authors, year) : '',
    props,
  };
};

export const convertToItemType = (item: RawNode): GraphNodeType<ItemProps> =>
  buildItemShell(item, NodeKind.Item, mapItemProps(item));

export const convertToCloneType = (item: RawNode): GraphNodeType<ItemProps> =>
  buildItemShell(item, NodeKind.Clone, mapItemProps(item));

export const convertToCollectionType = (
  item: RawNode,
): CollectionNodeType<CollectionProps> => {
  const id = item.identity.low;
  const props = mapCollectionProps(item);
  const graphLevel = lowToNumber(
    (item.properties as { graphLevel?: LowHigh }).graphLevel,
  );
  const title = props.collectionName || '';

  return {
    typeNumber: NodeKind.Collection,
    id,
    graphLevel: graphLevel ?? -1,
    linkedNodeIds: [],
    color: '#ff0000',
    group: APP_GROUP.Collection,
    title,
    titleInLines: [''],
    year: '',
    label: '',
    props,
    collectionLeaf: false,
  };
};

export default function dataAdapter(records: any[]): GraphData<ItemProps, CollectionProps> {
  const graphData = records?.reduce(
    (
      acc: GraphData<ItemProps, CollectionProps>,
      { _fields: [it] }: { _fields: (RawNode | RawRelationship)[] },
    ) => {
      if (!!(it as RawRelationship).type) {
        acc.edges.push(convertToEdgeType(it as RawRelationship));
      } else {
        const label = (it as RawNode).labels[0];
        switch (label) {
          case DB_LABEL.Item:
            acc.itemNodes.push(convertToItemType(it as RawNode));
            break;
          case DB_LABEL.Clone:
            acc.cloneNodes.push(convertToCloneType(it as RawNode));
            break;
          case DB_LABEL.Collection: {
            const raw = it as RawNode;
            if (
              (raw.properties as { graphLevel?: unknown }).graphLevel !==
              undefined
            ) {
              acc.collectionNodes.push(convertToCollectionType(raw));
            }
            break;
          }
          default:
            console.warn('result item is not recognised => item: ', it);
        }
      }
      return acc;
    },
    {
      treeNode: undefined,
      collectionNodes: [],
      itemNodes: [],
      cloneNodes: [],
      edges: [],
      edgesToSend: [],
      nodes: [],
    },
  );

  graphData.nodes = [
    ...graphData.collectionNodes,
    ...graphData.itemNodes,
    ...graphData.cloneNodes,
  ];
  graphData.edgesToSend = graphData.edges.map((edge) => ({ ...edge }));
  console.log({
    collectionNodes: graphData.collectionNodes.length,
    itemNodes: graphData.itemNodes.length,
    cloneNodes: graphData.cloneNodes.length,
    edges: graphData.edges.length,
    nodes: graphData.nodes.length,
  });
  return graphData;
}
