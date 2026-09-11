'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import CurrentPanel from '../current-panel';

import type { ReadingProps } from './reading-types';

export default function CurrentDialog({
  data,
  m,
  navigation,
  detailsReady,
  loading,
  currentMap,
  openEvidence,
}: Pick<
  ReadingProps,
  'data' | 'm' | 'navigation' | 'detailsReady' | 'loading'
> & {
  currentMap: (route: string, id: string) => void;
  openEvidence: (id: string) => void;
}) {
  return (
    <Dialog
      open={navigation.state.current}
      onClose={() => navigation.close('current')}
      fullWidth
      maxWidth="md"
      className="current-dialog"
      aria-labelledby="current-title"
    >
      <DialogTitle className="modal-heading" id="current-title">
        <span>{m.currentTitle}</span>
        <IconButton
          aria-label={m.close}
          onClick={() => navigation.close('current')}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {detailsReady ? (
          <CurrentPanel
            data={data}
            m={m}
            onMap={currentMap}
            onEvidence={openEvidence}
          />
        ) : (
          loading
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => navigation.go({ current: false, lens: 'current' })}
        >
          {m.currentBrowse}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
