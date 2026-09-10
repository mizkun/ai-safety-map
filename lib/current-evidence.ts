import type { Content, Node } from './content-types';

// These describe evidence for a condition, never its severity or probability.
// In particular, no observation / a definition cannot imply an effective barrier.
export type EvidenceSignal =
  | 'observed'
  | 'tested'
  | 'indirect'
  | 'unknown'
  | 'mitigation';
export function evidenceSignal(
  node: Pick<Node, 'id' | 'status'>,
  current: Pick<Content['current'], 'evidence'>,
): EvidenceSignal {
  return node.status === 'observed'
    ? 'observed'
    : node.status === 'limited'
      ? current.evidence[node.id]?.level === 'tested'
        ? 'tested'
        : 'indirect'
      : 'unknown';
}
export const evidenceColors: Record<EvidenceSignal, string> = {
  observed: '#bd4057',
  tested: '#986408',
  indirect: '#a38a43',
  unknown: '#778294',
  mitigation: '#187b63',
};
export const evidenceBackgrounds: Record<EvidenceSignal, string> = {
  observed: '#f9e0e5',
  tested: '#ffe09a',
  indirect: '#fff7d9',
  unknown: '#edf0f4',
  mitigation: '#ddf0e7',
};
