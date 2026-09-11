'use client';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { X } from 'lucide-react';

import type { ReadingProps } from './reading-types';

export default function TermDialog({
  data,
  m,
  navigation,
  tools,
  detailsReady,
  loading,
}: ReadingProps) {
  const { richText, source, historyBackButton } = tools;
  const termId = navigation.state.term;
  const term = termId ? data.glossary[termId] : undefined;
  return (
    <Dialog
      open={Boolean(term)}
      onClose={() => navigation.close('term')}
      fullWidth
      maxWidth="sm"
      className="term-dialog"
    >
      <DialogTitle className="modal-heading">
        <span className="term-heading">
          {historyBackButton()}
          {term?.name || m.definition}
        </span>
        <IconButton
          aria-label={m.close}
          onClick={() => navigation.close('term')}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!detailsReady
          ? loading
          : term && (
              <div className="term-content" key={termId}>
                <p className="lead-copy">{richText(term.definition)}</p>
                {term.example && (
                  <div className="example-block">
                    <p>{richText(term.example)}</p>
                  </div>
                )}
                <div className="limit-block">
                  <h3>{m.caution}</h3>
                  <p>{richText(term.limit)}</p>
                </div>
                {term.sources.map((id) => (
                  <div key={id}>{source(id)}</div>
                ))}
              </div>
            )}
      </DialogContent>
    </Dialog>
  );
}
