import { CircleDot, Triangle, CircleHelp, ShieldCheck } from 'lucide-react';
import type { Messages } from '@/lib/i18n';
import type { EvidenceSignal } from '@/lib/current-evidence';
export function evidenceLabel(signal: EvidenceSignal, m: Messages) {
  return {
    observed: m.signalObserved,
    limited: m.signalLimited,
    unknown: m.signalUnknown,
    mitigation: m.signalMitigation,
  }[signal];
}
export default function EvidenceMark({
  signal,
  size = 15,
}: {
  signal: EvidenceSignal;
  size?: number;
}) {
  const Icon = {
    observed: CircleDot,
    limited: Triangle,
    unknown: CircleHelp,
    mitigation: ShieldCheck,
  }[signal];
  return (
    <Icon
      className={'evidence-mark signal-' + signal}
      size={size}
      aria-hidden="true"
    />
  );
}
