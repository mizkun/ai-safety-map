'use client';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import type { LibraryPanel } from '@/lib/map-navigation';
import { repositoryUrl as REPO } from '@/lib/site-config';
import { Button, ButtonBase, Chip, TextField, Typography } from '@mui/material';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';
export type Panel = LibraryPanel;
type Props = {
  panel: Panel;
  data: Content;
  m: Messages;
  source: (id: string) => ReactNode;
  onNode: (id: string, map?: string) => void;
  onTerm: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
};
export default function ReadingPanels({
  panel,
  data,
  m,
  source,
  onNode,
  onTerm,
  search,
  onSearch,
}: Props) {
  if (panel === 'about')
    return (
      <div className="reading-body">
        {[
          m.about1,
          m.about2,
          m.about3,
          m.about4,
          m.about5,
          m.about6,
          m.about7,
          m.about8,
        ].map((p) => (
          <p key={p}>{p}</p>
        ))}
        <Button
          href={REPO + '/blob/main/docs/editorial-policy.md'}
          target="_blank"
          rel="noreferrer"
          endIcon={<ArrowUpRight size={16} />}
        >
          {m.contribute}
        </Button>
      </div>
    );
  if (panel === 'glossary') {
    const terms = Object.entries(data.glossary).filter(([, t]) =>
      (t.name + ' ' + t.aliases.join(' ') + ' ' + t.definition)
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    return (
      <div className="reading-body">
        <TextField
          fullWidth
          label={m.termSearch}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: <Search size={17} style={{ marginRight: 10 }} />,
            },
          }}
        />
        <div className="term-grid">
          {terms.map(([id, t]) => (
            <ButtonBase
              key={id}
              className="term-card"
              onClick={() => onTerm(id)}
            >
              {t.name}
            </ButtonBase>
          ))}
        </div>
        {!terms.length && <p>{m.noResults}</p>}
      </div>
    );
  }
  if (panel === 'history')
    return (
      <div className="reading-body">
        <ol className="history-timeline">
          {data.history.map((h) => (
            <li key={h.id}>
              <span className="history-date">{h.date}</span>
              <Chip size="small" label={h.kind} />
              <Typography variant="h6">{h.title}</Typography>
              <p>{h.summary}</p>
              <div className="history-diff">
                <p>{h.before}</p>
                <ArrowDownIcon />
                <p>{h.after}</p>
              </div>
              <p>{h.reason}</p>
              <div className="chip-links">
                {h.nodes.map((id) => (
                  <Chip
                    key={id}
                    size="small"
                    label={id}
                    onClick={() => onNode(id)}
                  />
                ))}
              </div>
              {h.sources.map((id) => (
                <div key={id}>{source(id)}</div>
              ))}
            </li>
          ))}
        </ol>
        <Button
          href={REPO + '/commits/main/'}
          target="_blank"
          rel="noreferrer"
          endIcon={<ArrowUpRight size={16} />}
        >
          {m.allChanges}
        </Button>
      </div>
    );
  return (
    <div className="reading-body source-list">
      {Object.keys(data.sources).map((id) => (
        <div key={id}>{source(id)}</div>
      ))}
    </div>
  );
}
function ArrowDownIcon() {
  return <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />;
}
