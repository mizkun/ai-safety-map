import { Button, ButtonBase } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import {
  evidenceSignal,
  evidenceBackgrounds,
  type EvidenceSignal,
} from '@/lib/current-evidence';
import EvidenceMark, { evidenceLabel } from './evidence-mark';

export default function CurrentPanel({
  data,
  m,
  onMap,
  onEvidence,
}: {
  data: Content;
  m: Messages;
  onMap: (route: string, node: string) => void;
  onEvidence: (node: string) => void;
}) {
  const notes = {
    observed: m.signalObservedNote,
    tested: m.signalTestedNote,
    indirect: m.signalIndirectNote,
    unknown: m.signalUnknownNote,
    mitigation: m.signalMitigationNote,
  };
  return (
    <div className="current-body">
      <p className="current-intro">{m.currentIntro}</p>
      <div className="current-legend">
        {(
          [
            'observed',
            'tested',
            'indirect',
            'unknown',
            'mitigation',
          ] as EvidenceSignal[]
        ).map((signal) => (
          <div key={signal}>
            <span
              className="current-swatch"
              style={{ background: evidenceBackgrounds[signal] }}
            >
              <EvidenceMark signal={signal} size={19} />
            </span>
            <span>
              <strong>{evidenceLabel(signal, m)}</strong>
              <small>{notes[signal]}</small>
            </span>
          </div>
        ))}
      </div>
      <p className="current-note">{m.currentNote}</p>
      <div className="current-route-grid">
        {data.routes
          .filter((r) => r.role !== 'factor')
          .map((route) => {
            const item = data.current.routes[route.id];
            return (
              <section className="current-route" key={route.id}>
                <h3>{route.shortTitle}</h3>
                <ButtonBase
                  className="current-observed"
                  onClick={() => onEvidence(item.observed)}
                >
                  <EvidenceMark
                    signal={evidenceSignal(
                      data.nodes[item.observed],
                      data.current,
                    )}
                  />
                  <span>{data.nodes[item.observed].shortTitle}</span>
                  <ArrowRight size={14} />
                </ButtonBase>
                <p>{item.finding}</p>
                <ButtonBase
                  className="current-question"
                  onClick={() => onMap(route.id, item.node)}
                >
                  <EvidenceMark
                    signal={evidenceSignal(data.nodes[item.node], data.current)}
                    size={18}
                  />
                  <span>
                    <small>{m.currentFocus}</small>
                    <strong>{item.next}</strong>
                  </span>
                  <ArrowRight size={17} />
                </ButtonBase>
                <footer>
                  <small>
                    {m.currentDate} {item.review.checkedAt}
                  </small>
                  <Button
                    size="small"
                    onClick={() => onMap(route.id, item.node)}
                  >
                    {m.currentMap}
                  </Button>
                </footer>
              </section>
            );
          })}
      </div>
      <section className="current-tested">
        <h3>
          <EvidenceMark signal="mitigation" size={20} />
          {m.currentSafeguards}
        </h3>
        {Object.entries(data.current.safeguards).map(([id, item]) => (
          <div key={id}>
            <Button
              onClick={() => onEvidence(id)}
              endIcon={<ArrowRight size={16} />}
            >
              {item.title}
            </Button>
            <p>{item.summary}</p>
            <small>{item.limit}</small>
          </div>
        ))}
      </section>
    </div>
  );
}
