import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NodesSelection, SelectionActionType, SelectionSource, selectionReducer } from './selectionReducer';

interface SelectionContextProps {
  state: NodesSelection;
  dispatch: React.Dispatch<SelectionActionType>;
}
interface SelectionProviderProps {
  children: ReactNode;
}

const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

export const SelectionProvider = ({ children }:SelectionProviderProps) => {
  const [state, dispatch] = useReducer(selectionReducer,  {
    lastSelectedNodeData: undefined,
    lastSelectedNodeClones: [],
    itemsSelectionIds: [],
    clonesSelection: [],
    selectionSource: SelectionSource.FILTER_PANEL,
  });

  return (
    <SelectionContext.Provider value={{ state, dispatch }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
