import {
  CircleDot,
  CircleEllipsis,
  CircleDashed,
  CircleHelp,
  CircleCheck,
} from 'lucide-react';
import type { Messages } from '@/lib/i18n';
import type { EvidenceSignal } from '@/lib/current-evidence';
export function evidenceLabel(signal: EvidenceSignal, m: Messages) {
  return {
    observed: m.signalObserved,
    tested: m.signalTested,
    indirect: m.signalIndirect,
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
    tested: CircleEllipsis,
    indirect: CircleDashed,
    unknown: CircleHelp,
    mitigation: CircleCheck,
  }[signal];
  return (
    <Icon
      className={'evidence-mark signal-' + signal}
      size={size}
      aria-hidden="true"
    />
  );
}
