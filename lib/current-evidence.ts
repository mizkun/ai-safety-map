import type { EvidenceState } from './content-types';

// These describe evidence for a condition, never its severity or probability.
// In particular, no observation / a definition cannot imply an effective barrier.
export type EvidenceSignal = 'observed' | 'limited' | 'unknown' | 'mitigation';
export function evidenceSignal(status: EvidenceState): EvidenceSignal {
  return status === 'observed'
    ? 'observed'
    : status === 'limited'
      ? 'limited'
      : 'unknown';
}
export const evidenceColors: Record<EvidenceSignal, string> = {
  observed: '#bd4057',
  limited: '#b0780e',
  unknown: '#778294',
  mitigation: '#187b63',
};
