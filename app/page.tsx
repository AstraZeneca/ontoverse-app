'use client';

import { useEffect } from 'react';
import { GraphDataProvider } from '@/components/GraphDataContext';
import { SelectionProvider } from '@/lib/state/SelectionProvider';
import { useSelectStore } from '@/model/store/useSelection';
import RightDrawer from '@/components/RightDrawer';

export default function Home() {
  const enableMultiSelect = useSelectStore((state) => state.enableMultiSelect);
  const disableMultiSelect = useSelectStore((state) => state.disableMultiSelect);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Shift') {
        enableMultiSelect();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Shift') {
        disableMultiSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enableMultiSelect, disableMultiSelect]);

  return (
    <GraphDataProvider>
      <SelectionProvider>
        <RightDrawer />
      </SelectionProvider>
    </GraphDataProvider>
  );
}

