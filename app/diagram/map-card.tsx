'use client';
import type { Content } from '@/lib/content-types';
import { evidenceBackgrounds, evidenceSignal } from '@/lib/current-evidence';
import { reviewStatus } from '@/lib/freshness.mjs';
import type { Messages } from '@/lib/i18n';
import { type NavigationState } from '@/lib/map-navigation';
import { ButtonBase, Paper, Tooltip } from '@mui/material';
import { Clock3, Info, RotateCcw } from 'lucide-react';
import { type CSSProperties } from 'react';
import EvidenceMark, { evidenceLabel } from '../evidence-mark';

import type { TreeTile } from '@/lib/tree-types';
type ScreenPoint = (x: number, y: number) => { left: number; top: number };

type Props = {
  tile: TreeTile;
  data: Content;
  m: Messages;
  today: string;
  selected: string | null;
  highlightedTourNodes: string[];
  isTour: boolean;
  navigationState: NavigationState;
  detailLevel: 'atlas' | 'compact' | 'reading';
  scale: number;
  screen: ScreenPoint;
  onEvidence: (id: string) => void;
  onTerm: (id: string) => void;
  onActivate: () => void;
};
export default function MapCard({
  tile,
  data,
  m,
  today,
  selected,
  highlightedTourNodes,
  isTour,
  navigationState,
  detailLevel,
  scale,
  screen,
  onEvidence,
  onTerm,
  onActivate,
}: Props) {
  const node = tile.node ? data.nodes[tile.node] : undefined;
  const tourHighlight = highlightedTourNodes.includes(tile.node || '');
  const route = tile.graph
    ? data.routes.find((r) => r.id === tile.graph)
    : undefined;
  const title = tile.label
    ? m[tile.label]
    : node?.title || route?.shortTitle || '';
  const due = node && reviewStatus(node.review, today).state === 'due';
  const showId =
    detailLevel === 'reading' && node && node.id !== 'NOW' && !tile.graph;
  const signal =
    navigationState.lens && node && node.id !== 'NOW' && !tile.graph
      ? evidenceSignal(node, data.current)
      : null;
  return (
    <Paper
      elevation={0}
      key={tile.key}
      className={
        'tree-tile tile-' +
        tile.kind +
        (showId ? ' tile-identified' : '') +
        (signal ? ' tile-evidence-color' : '') +
        (selected === tile.node ? ' tile-selected' : '') +
        (tile.node === 'X' ? ' tile-terminal' : '') +
        (tile.node === 'NOW' ? ' tile-present' : '') +
        (tourHighlight
          ? ' tile-tour-focus'
          : isTour && tile.kind !== 'route' && tile.node !== 'NOW'
            ? ' tile-tour-context'
            : '')
      }
      style={
        {
          ...screen(tile.x, tile.y),
          width: tile.width * scale,
          height: tile.height * scale,
          '--branch-color': tile.color,
          '--evidence-background': signal
            ? evidenceBackgrounds[signal]
            : undefined,
        } as CSSProperties
      }
    >
      {showId && <span className="node-id tile-id">{node.id}</span>}
      {signal && node && detailLevel === 'reading' && (
        <div className="tile-signals">
          <Tooltip title={evidenceLabel(signal, m) + ' · ' + node.shortTitle}>
            <ButtonBase
              className="tile-evidence-button"
              onClick={() => onEvidence(node.id)}
              aria-label={node.id + ' · ' + evidenceLabel(signal, m)}
            >
              <EvidenceMark signal={signal} size={15} />
            </ButtonBase>
          </Tooltip>
          {data.current.safeguards[node.id] && (
            <Tooltip title={m.signalMitigation}>
              <ButtonBase
                className="tile-safeguard-button"
                onClick={() => onEvidence(node.id)}
                aria-label={node.id + ' · ' + m.signalMitigation}
              >
                <EvidenceMark signal="mitigation" size={15} />
              </ButtonBase>
            </Tooltip>
          )}
        </div>
      )}
      <ButtonBase
        className="tile-open"
        aria-current={tourHighlight ? 'step' : undefined}
        onClick={onActivate}
        aria-label={title + ' · ' + (tile.graph ? m.branch : m.read)}
      >
        <span className="tile-eyebrow">
          <span className="tile-dot" />
          {tile.kind === 'research' ? (
            <RotateCcw size={15} />
          ) : tile.node === 'NOW' ? (
            detailLevel === 'atlas' ? (
              m.present
            ) : (
              data.asOf
            )
          ) : (
            route?.number || node?.id
          )}
          {due && (
            <span className="tile-review" title={m.due}>
              <Clock3 size={14} />
            </span>
          )}
        </span>
        <span className="tile-title">
          {tile.shortLabel
            ? m[tile.shortLabel]
            : tile.label
              ? m[tile.label]
              : node?.shortTitle || title}
        </span>
      </ButtonBase>
      {detailLevel === 'reading' && !!node?.topics?.length && (
        <div className="tile-topics">
          {node.topics.map((id) => (
            <ButtonBase
              key={id}
              className="tile-topic"
              onClick={() => onTerm(id)}
              aria-label={data.glossary[id].name + ' · ' + m.definition}
            >
              {data.glossary[id].name.split('（')[0]}
              <Info size={12} />
            </ButtonBase>
          ))}
        </div>
      )}
    </Paper>
  );
}
