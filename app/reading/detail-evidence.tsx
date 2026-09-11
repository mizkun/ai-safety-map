import { evidenceSignal } from '@/lib/current-evidence';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
} from '@mui/material';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import EvidenceMark, { evidenceLabel } from '../evidence-mark';
import { detailSection } from './detail-section';

import type { Edge, Node } from '@/lib/content-types';
import { repositoryUrl as REPO } from '@/lib/site-config';
import type { ReadingProps } from './reading-types';

export default function DetailEvidence({
  data,
  m,
  navigation,
  tools,
  node,
  edge,
  selected,
}: Pick<ReadingProps, 'data' | 'm' | 'navigation' | 'tools'> & {
  node?: Node;
  edge?: Edge;
  selected: string | null;
}) {
  const { richText, source, reviewNote } = tools;

  const item = node || edge;
  if (!item) return null;
  const cited = new Set(item.research.map((id) => data.research[id].source));
  const extraSources = item.sources.filter((id) => !cited.has(id));
  return (
    <>
      {node && (
        <div className="evidence-heading">
          <EvidenceMark signal={evidenceSignal(node, data.current)} size={20} />
          <strong>
            {evidenceLabel(evidenceSignal(node, data.current), m)}
          </strong>
          <small>
            {m.currentDate} {node.review.checkedAt}
          </small>
        </div>
      )}
      {node && data.current.evidence[node.id] && (
        <p className="evidence-scope">
          {richText(data.current.evidence[node.id].summary)}
        </p>
      )}
      <p className="lead-copy">
        {richText(node ? node.body['現在の状況'] : edge!.current)}
      </p>
      {node &&
        data.current.safeguards[node.id] &&
        (() => {
          const s = data.current.safeguards[node.id];
          return (
            <section className="current-tested">
              <h3>
                <EvidenceMark signal="mitigation" size={20} />
                {s.title}
              </h3>
              <p>{s.summary}</p>
              <p>{s.limit}</p>
              <small>
                {m.currentDate} {s.review.checkedAt}
              </small>
              {s.sources.map((id) => (
                <div key={id}>{source(id)}</div>
              ))}
            </section>
          );
        })()}
      {edge && <p className="evidence-basis">{richText(edge.basis)}</p>}
      {item.research.map((id, i) => {
        const r = data.research[id];
        return (
          <Accordion
            key={id}
            expanded={
              navigation.state.research
                ? navigation.state.research.includes(id)
                : i === 0
            }
            disableGutters
            className="research-card"
            onChange={(event, isOpen) => {
              const current =
                navigation.state.research || item.research.slice(0, 1);
              navigation.go({
                research: isOpen
                  ? [...current, id]
                  : current.filter((key) => key !== id),
              });
              if (!isOpen) return;
              const card = event.currentTarget.closest('.research-card');
              const scroll = card?.closest('.detail-scroll');
              if (!card || !scroll) return;
              const offset =
                card.getBoundingClientRect().top -
                scroll.getBoundingClientRect().top;
              requestAnimationFrame(() => {
                const delta =
                  card.getBoundingClientRect().top -
                  scroll.getBoundingClientRect().top -
                  Math.max(8, offset);
                if (delta) scroll.scrollTop += delta;
              });
            }}
          >
            <AccordionSummary expandIcon={<ChevronDown size={18} />}>
              <span>
                <small>{r.kind}</small>
                <strong>{r.title}</strong>
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <dl className="research-facts">
                {[
                  [m.evaluator, r.evaluator],
                  [m.setting, r.setting],
                  [m.method, r.method],
                  [m.result, r.result],
                  [m.studyLimit, r.limitation],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{richText(value)}</dd>
                  </div>
                ))}
              </dl>
              {source(r.source)}
              <p className="source-locator">
                {m.sourceLocation}: {r.locator}
              </p>
            </AccordionDetails>
          </Accordion>
        );
      })}
      {detailSection(
        m.limitations,
        <p>{richText(node ? node.body['根拠の限界'] : edge!.limitation)}</p>,
        undefined,
        'limit-block',
      )}
      {reviewNote(item.review)}
      {!!extraSources.length &&
        detailSection(
          m.sources,
          <div className="source-list">
            {extraSources.map((id) => (
              <div key={id}>{source(id)}</div>
            ))}
          </div>,
        )}
      <div className="contribute-block">
        <Link
          href={
            REPO +
            '/issues/new?template=correction.yml&title=' +
            encodeURIComponent(
              '[' + selected + '] ' + (node?.title || edge?.label || ''),
            )
          }
          target="_blank"
          rel="noreferrer"
        >
          {m.reportIssue}
          <ArrowUpRight size={13} />
        </Link>
        <Link
          href={REPO + '/blob/main/CONTRIBUTING.md'}
          target="_blank"
          rel="noreferrer"
        >
          {m.propose}
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </>
  );
}
