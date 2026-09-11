'use client';
import type { Review } from '@/lib/content-types';
import { reviewStatus } from '@/lib/freshness.mjs';
import { glossaryIndex, glossarySegments } from '@/lib/glossary-text.mjs';
import {
  nodeReferenceIndex,
  nodeReferenceSegments,
} from '@/lib/node-reference-text.mjs';
import { ButtonBase, IconButton, Link, Tooltip } from '@mui/material';
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';

import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import type { MapNavigation } from '../use-map-navigation';

export function useReadingTools({
  data,
  m,
  navigation,
  today,
  openNode,
  openTerm,
}: {
  data: Content;
  m: Messages;
  navigation: MapNavigation;
  today: string;
  openNode: (id: string, map?: string) => void;
  openTerm: (id: string) => void;
}) {
  const termId = navigation.state.term;
  const termIndex = useMemo(
    () => glossaryIndex(data.glossary),
    [data.glossary],
  );
  const referenceIndex = useMemo(
    () => nodeReferenceIndex(data.nodes),
    [data.nodes],
  );
  function richText(text: string): ReactNode {
    return glossarySegments(text, termIndex).map(({ text: part, id }, i) => {
      return id === termId ? (
        part
      ) : id ? (
        <ButtonBase
          component="button"
          disableRipple
          className="term-inline"
          key={i}
          onClick={() => openTerm(id)}
          aria-label={part + ' · ' + m.definition}
        >
          {part}
        </ButtonBase>
      ) : (
        nodeReferenceSegments(part, referenceIndex).map((reference, j) =>
          reference.id ? (
            <Tooltip
              title={reference.id + ' · ' + data.nodes[reference.id].shortTitle}
              key={i + ':' + j}
            >
              <ButtonBase
                component="button"
                disableRipple
                className="term-inline node-reference"
                onClick={() => openNode(reference.id!)}
                aria-label={
                  reference.id +
                  ' · ' +
                  data.nodes[reference.id].shortTitle +
                  ' · ' +
                  m.read
                }
              >
                {reference.text}
              </ButtonBase>
            </Tooltip>
          ) : (
            reference.text
          ),
        )
      );
    });
  }
  function source(id: string) {
    const s = data.sources[id];
    return s ? (
      <Link
        className="source-link"
        href={s.url}
        target="_blank"
        rel="noreferrer"
        underline="none"
      >
        <span>
          {s.title}
          <ArrowUpRight size={13} />
        </span>
        <small>
          {m.published}: {s.published || m.unknownDate} · {m.period}: {s.period}{' '}
          · {m.checked}: {s.checked}
        </small>
        <small>{s.primary}</small>
      </Link>
    ) : null;
  }
  function reviewNote(review: Review) {
    const r = reviewStatus(review, today);
    return (
      <div
        className={'detail-review ' + (r.state === 'due' ? 'is-overdue' : '')}
      >
        <div>
          <Clock3 size={14} />
          <span>
            {m.lastReview} {review.checkedAt} · {m.nextReview} {r.dueAt}
          </span>
        </div>
        <p>{review.reason}</p>
        {r.state === 'due' && (
          <p>
            <strong>{m.due} · </strong>
            {m.overdueNote}
          </p>
        )}
      </div>
    );
  }
  function historyBackButton() {
    return (
      navigation.canBack && (
        <Tooltip title={m.previous}>
          <IconButton aria-label={m.previous} onClick={navigation.back}>
            <ArrowLeft size={19} />
          </IconButton>
        </Tooltip>
      )
    );
  }
  return { richText, source, reviewNote, historyBackButton };
}
