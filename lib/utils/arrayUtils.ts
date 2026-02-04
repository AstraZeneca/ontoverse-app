import { BranchNodeByD3 } from "@/model/GraphDataModel";

export const getUniqueStrings = (arr:string[]):string[] => arr.reduce((acc, currentValue) => {
    if (!acc.includes(currentValue)) {
      acc.push(currentValue);
    }
    return acc;
  }, [] as string[]);

  export const getUniqueNumbers = (arr:number[]):number[] => arr.reduce((acc, currentValue) => {
    if (!acc.includes(currentValue)) {
      acc.push(currentValue);
    }
    return acc;
  }, [] as number[]);

  export const getUniqueNodes = (arr:BranchNodeByD3[]):BranchNodeByD3[] => arr.reduce((acc, currentNode) => {
    if (!acc.some(node => node.data.id === currentNode.data.id)) {
      acc.push(currentNode);
    }
    return acc;
  }, [] as BranchNodeByD3[]);