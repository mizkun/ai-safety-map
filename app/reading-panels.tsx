'use client';
import { useMemo, useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ButtonBase,
  Chip,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { ArrowRight, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import type { Content } from '@/lib/content-types';
import { formatMessage, type Messages } from '@/lib/i18n';
import { reviewStatus } from '@/lib/freshness.mjs';
const REPO = 'https://github.com/mizkun/ai-safety-map';
export type Panel =
  | 'about'
  | 'glossary'
  | 'news'
  | 'history'
  | 'freshness'
  | 'sources';
type Props = {
  panel: Panel;
  data: Content;
  m: Messages;
  today: string;
  richText: (value: string) => ReactNode;
  source: (id: string) => ReactNode;
  onNode: (id: string, map?: string) => void;
  onEdge: (id: string) => void;
  onTerm: (id: string) => void;
};
export default function ReadingPanels({
  panel,
  data,
  m,
  today,
  richText,
  source,
  onNode,
  onEdge,
  onTerm,
}: Props) {
  const [search, setSearch] = useState('');
  const reviews = useMemo(
    () =>
      [
        ...Object.values(data.nodes).map((n) => ({
          id: n.id,
          title: n.title,
          review: n.review,
          mode: 'node',
        })),
        ...Object.values(data.edges).map((e) => ({
          id: e.id,
          title: e.label,
          review: e.review,
          mode: 'edge',
        })),
      ]
        .map((r) => ({ ...r, ...reviewStatus(r.review, today) }))
        .sort(
          (a, b) => a.dueAt.localeCompare(b.dueAt) || a.id.localeCompare(b.id),
        ),
    [data, today],
  );
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
          onChange={(e) => setSearch(e.target.value)}
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
              <ArrowUpRight size={15} />
            </ButtonBase>
          ))}
        </div>
        {!terms.length && <p>{m.noResults}</p>}
      </div>
    );
  }
  if (panel === 'news')
    return (
      <div className="reading-body">
        <p className="panel-intro">{m.newsIntro}</p>
        {data.news.map((n) => (
          <article className="reading-article" key={n.id}>
            <Typography variant="h6">{n.title}</Typography>
            {source(n.source)}
            <h3>{m.whereNews}</h3>
            <p>{richText(n.finding)}</p>
            <div className="link-stack">
              {n.links.map((l) => (
                <Button
                  key={l.node}
                  onClick={() => onNode(l.node, l.map)}
                  endIcon={<ArrowRight size={15} />}
                >
                  {data.nodes[l.node].title}
                </Button>
              ))}
            </div>
            <div className="limit-block">
              <h3>{m.limitations}</h3>
              <p>{richText(n.limit)}</p>
            </div>
            <h3>{m.checkNext}</h3>
            <p>{richText(n.next)}</p>
          </article>
        ))}
        <Button
          href={REPO + '/issues/new?template=research.yml'}
          target="_blank"
          rel="noreferrer"
          endIcon={<ArrowUpRight size={16} />}
        >
          {m.addResearch}
        </Button>
      </div>
    );
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
  if (panel === 'freshness') {
    const due = reviews.filter((r) => r.state === 'due').length;
    return (
      <div className="reading-body">
        <Typography variant="h6">{m.freshnessTitle}</Typography>
        <p>{m.freshnessIntro}</p>
        <div className="update-flow">
          {[
            [m.updateStep1, m.updateStep1Text],
            [m.updateStep2, m.updateStep2Text],
            [m.updateStep3, m.updateStep3Text],
          ].map(([title, text], i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p>{m.freshnessMeaning}</p>
        <div className="freshness-summary">
          <strong>{formatMessage(m.reviewCount, { count: due })}</strong>
          <small>{formatMessage(m.dateBasis, { date: today })}</small>
        </div>
        <Accordion disableGutters defaultExpanded={due > 0}>
          <AccordionSummary expandIcon={<ChevronDown size={18} />}>
            {m.reviewList}
          </AccordionSummary>
          <AccordionDetails className="review-rows">
            {reviews.map((r) => (
              <ButtonBase
                key={r.id}
                className="review-row"
                onClick={() =>
                  r.mode === 'node' ? onNode(r.id) : onEdge(r.id)
                }
              >
                <span>
                  <strong>
                    {r.id} · {r.title}
                  </strong>
                  <small>
                    {m.lastReview} {r.review.checkedAt} · {m.nextReview}{' '}
                    {r.dueAt}
                  </small>
                </span>
                <Chip
                  size="small"
                  label={
                    r.state === 'due'
                      ? m.due
                      : r.state === 'soon'
                        ? m.soon
                        : m.scheduled
                  }
                  className={r.state === 'due' ? 'chip-overdue' : ''}
                />
              </ButtonBase>
            ))}
          </AccordionDetails>
        </Accordion>
        <h3>{m.watchSources}</h3>
        <div className="watch-grid">
          {data.watchlist.map((w) => (
            <article key={w.id}>
              <h4>{w.name}</h4>
              <small>{w.cadence === 'daily' ? m.daily : m.weekly}</small>
              <p>{w.focus}</p>
              {w.urls.map((url, i) => (
                <Link key={url} href={url} target="_blank" rel="noreferrer">
                  {m.sourceEntry}
                  {w.urls.length > 1 ? ' ' + (i + 1) : ''}
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </article>
          ))}
        </div>
        <Button
          href={REPO + '/blob/main/docs/keeping-current.md'}
          target="_blank"
          rel="noreferrer"
          endIcon={<ArrowUpRight size={16} />}
        >
          {m.updateGuide}
        </Button>
      </div>
    );
  }
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
