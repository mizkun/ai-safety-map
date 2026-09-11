'use client';
import { libraryPanels } from '@/lib/map-navigation';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import type { Panel } from '../reading-panels';

import type { ReadingProps } from './reading-types';
const ReadingPanels = lazy(() => import('../reading-panels'));

export default function LibraryDialog({
  data,
  m,
  navigation,
  tools,
  detailsReady,
  loading,
  openNode,
  openTerm,
  navigate,
}: ReadingProps & {
  openNode: (id: string, map?: string) => void;
  openTerm: (id: string) => void;
  navigate: (map: Panel) => void;
}) {
  const { source } = tools;
  const { panel } = navigation.state;
  const panels = libraryPanels;
  return (
    <Dialog
      open={Boolean(panel)}
      onClose={() => navigation.close('panel')}
      fullWidth
      maxWidth="md"
      className="library-dialog"
    >
      <DialogTitle className="modal-heading">
        <span>{panel ? m[panel] : m.library}</span>
        <IconButton
          aria-label={m.close}
          onClick={() => navigation.close('panel')}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <Tabs
        value={panel || 'about'}
        onChange={(_, value: Panel) => navigate(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        className="library-tabs"
      >
        {panels.map((p) => (
          <Tab key={p} value={p} label={m[p]} />
        ))}
      </Tabs>
      <DialogContent dividers>
        {!detailsReady
          ? loading
          : panel && (
              <Suspense fallback={loading}>
                <ReadingPanels
                  panel={panel}
                  data={data}
                  m={m}
                  source={source}
                  onNode={openNode}
                  onTerm={openTerm}
                  search={navigation.state.search}
                  onSearch={(search) => navigation.go({ search }, true)}
                />
              </Suspense>
            )}
      </DialogContent>
    </Dialog>
  );
}
