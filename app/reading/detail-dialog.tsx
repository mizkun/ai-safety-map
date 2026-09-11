import type { Question } from '@/lib/content-types';
import { reviewStatus } from '@/lib/freshness.mjs';
import { formatMessage } from '@/lib/i18n';
import { detailTabs, type DetailTab } from '@/lib/map-navigation';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Layers3,
  ShieldCheck,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { detailSection } from './detail-section';

import DetailEvidence from './detail-evidence';
import type { ReadingProps } from './reading-types';

export default function DetailDialog({
  data,
  m,
  navigation,
  tools,
  detailsReady,
  loading,
  today,
  openNode,
  openTerm,
  openEdge,
  navigate,
  onShowNode,
}: ReadingProps & {
  today: string;
  openNode: (id: string, map?: string) => void;
  openTerm: (id: string) => void;
  openEdge: (id: string) => void;
  navigate: (map: string, id?: string) => void;
  onShowNode: (id: string) => void;
}) {
  const { richText, source, historyBackButton } = tools;
  const { view } = navigation.state;
  const selected = navigation.state.detail?.id || null;
  const mode = navigation.state.detail?.kind || 'node';
  const detailKey = mode + ':' + selected;
  const detailTab = navigation.state.detail?.tab || 'summary';
  const node = mode === 'node' && selected ? data.nodes[selected] : undefined;
  const edge = mode === 'edge' && selected ? data.edges[selected] : undefined;
  const graph = data.graphs[view];
  const nodeIndex = node ? (graph?.nodes.indexOf(node.id) ?? -1) : -1;
  function setDetailTab(tab: DetailTab) {
    navigation.go((previous) =>
      previous.detail
        ? { ...previous, detail: { ...previous.detail, tab } }
        : previous,
    );
  }
  function questions(items: Question[], prefix: string): ReactNode {
    return items.map((q, i) => (
      <Accordion
        disableGutters
        key={prefix + '.' + i}
        className="question"
        expanded={navigation.state.questions.includes(prefix + '.' + i)}
        onChange={(_, open) =>
          navigation.go((previous) => ({
            ...previous,
            questions: open
              ? [...previous.questions, prefix + '.' + i]
              : previous.questions.filter((id) => id !== prefix + '.' + i),
          }))
        }
      >
        <AccordionSummary expandIcon={<ChevronDown size={17} />}>
          {q.q}
        </AccordionSummary>
        <AccordionDetails>
          <p>{richText(q.a)}</p>
          {q.src && source(q.src)}
          {q.children && questions(q.children, prefix + '.' + i)}
        </AccordionDetails>
      </Accordion>
    ));
  }
  function parentView(parent: string) {
    return (
      Object.values(data.graphs).find((g) => g.nodes.includes(parent))?.id ||
      'overview'
    );
  }
  function summaryBody() {
    if (node)
      return (
        <>
          <p className="lead-copy">{richText(node.body['概要'])}</p>
          {detailSection(
            m.whyNext,
            <p>{richText(node.body['他の条件との関係'])}</p>,
          )}
          {detailSection(
            m.additionalConditions,
            <p>{richText(node.body['成立条件'])}</p>,
          )}
          {node.subgraph && view !== 'overview' && view !== 'acceleration' && (
            <Button
              className="explore-button"
              fullWidth
              variant="outlined"
              startIcon={<Layers3 size={18} />}
              endIcon={<ArrowRight size={17} />}
              onClick={() => {
                onShowNode(node.id);
              }}
            >
              {m.showOnMap}
            </Button>
          )}
        </>
      );
    if (!edge) return null;
    return (
      <>
        <p className="lead-copy">{richText(edge.explanation)}</p>
        <div className="edge-context">
          <div className="edge-inputs">
            {edge.requires && (
              <span className="edge-joint-label">AND · {m.joint}</span>
            )}
            {(edge.requires || [edge.from]).map((id) => (
              <Button key={id} onClick={() => openNode(id)}>
                {data.nodes[id].title}
              </Button>
            ))}
          </div>
          <ArrowRight className="edge-direction" size={20} aria-hidden="true" />
          <Button onClick={() => openNode(edge.to)}>
            {data.nodes[edge.to].title}
          </Button>
        </div>
        {detailSection(
          m.additionalConditions,
          <ul>
            {edge.conditions.map((c) => (
              <li key={c}>{richText(c)}</li>
            ))}
          </ul>,
        )}
      </>
    );
  }
  function moreBody() {
    if (edge)
      return detailSection(
        m.safeguards,
        <p>{richText(edge.safeguards)}</p>,
        <ShieldCheck size={17} />,
      );
    if (!node) return null;
    const terms = [...new Set([...(node.topics || []), ...(node.terms || [])])];
    const candidates = graph?.edges || Object.keys(data.edges);
    const connections = candidates.filter((id) => {
      const e = data.edges[id];
      return (
        e.from === node.id || e.to === node.id || e.requires?.includes(node.id)
      );
    });
    return (
      <>
        {detailSection(
          m.safeguards,
          <p>{richText(node.body['考えられる対策'])}</p>,
          <ShieldCheck size={17} />,
        )}
        {node.body['具体例'] &&
          detailSection(m.example, <p>{richText(node.body['具体例'])}</p>)}
        {!!terms.length &&
          detailSection(
            m.glossary,
            <div className="chip-links">
              {terms.map((id) => (
                <Chip
                  key={id}
                  size="small"
                  label={data.glossary[id].name}
                  onClick={() => openTerm(id)}
                />
              ))}
            </div>,
          )}
        {!!node.watch?.length &&
          detailSection(
            m.watch,
            <ul>
              {node.watch.map((w) => (
                <li key={w}>{richText(w)}</li>
              ))}
            </ul>,
          )}
        {!!node.questions.length &&
          detailSection(m.more, questions(node.questions, node.id))}
        {!!connections.length &&
          detailSection(
            m.connections,
            <nav className="network-navigation" aria-label={m.connections}>
              {connections.map((id) => (
                <Button
                  key={id}
                  onClick={() => openEdge(id)}
                  endIcon={<ArrowRight size={15} />}
                >
                  {data.edges[id].label}
                </Button>
              ))}
            </nav>,
          )}
        {!!node.related.length &&
          detailSection(
            m.related,
            <div className="link-stack">
              {node.related.map((l) => (
                <Button
                  key={l.text}
                  onClick={() => openNode(l.node, l.scene)}
                  endIcon={<ArrowRight size={16} />}
                >
                  {l.text}
                </Button>
              ))}
            </div>,
          )}
        {graph?.parent && (
          <Button
            className="parent-link"
            startIcon={<ArrowLeft size={15} />}
            onClick={() => navigate(parentView(graph.parent!), graph.parent)}
          >
            {m.returnParent}
          </Button>
        )}
      </>
    );
  }
  function stepNavigation() {
    if (edge || view === 'overview' || graph?.mode === 'network') return null;
    if (!node || !graph || nodeIndex < 0) return null;
    const previous = graph.nodes[nodeIndex - 1],
      next = graph.nodes[nodeIndex + 1];
    const nextEdge =
      graph.mode === 'sequence' ? graph.edges[nodeIndex] : undefined;
    return (
      <nav className="step-navigation" aria-label={m.explanation}>
        <Button
          disabled={!previous}
          onClick={() => openNode(previous)}
          startIcon={<ArrowLeft size={15} />}
        >
          {m.previous}
        </Button>
        <span>
          {formatMessage(graph.mode === 'sequence' ? m.stepOf : m.conditionOf, {
            current: nodeIndex + 1,
            total: graph.nodes.length,
          })}
        </span>
        {next ? (
          <Button
            onClick={() => (nextEdge ? openEdge(nextEdge) : openNode(next))}
            endIcon={<ArrowRight size={15} />}
          >
            {m.next}
          </Button>
        ) : (
          <Button onClick={() => navigation.close('detail')}>
            {m.returnMap}
          </Button>
        )}
      </nav>
    );
  }
  return (
    <Dialog
      open={Boolean(node || edge)}
      onClose={() => navigation.close('detail')}
      fullWidth
      maxWidth="md"
      className="detail-dialog"
      aria-labelledby="detail-title"
    >
      {(node || edge) && (
        <>
          <div className="detail-header">
            <div className="detail-meta">
              <span>
                {historyBackButton()}
                {node && <span className="node-id">{node.id}</span>}
                {node ? m.explanation : m.connection}
              </span>
              <IconButton
                aria-label={m.close}
                onClick={() => navigation.close('detail')}
              >
                <X size={21} />
              </IconButton>
            </div>
            <Typography
              component="h2"
              id="detail-title"
              className="detail-title"
            >
              {richText(node?.title || edge?.label || '')}
            </Typography>
            {reviewStatus((node || edge)!.review, today).state === 'due' && (
              <Button
                className="review-alert"
                startIcon={<Clock3 size={14} />}
                onClick={() => setDetailTab('evidence')}
              >
                {m.due}
              </Button>
            )}
          </div>
          <Tabs
            value={detailTab}
            onChange={(_, tab: DetailTab) => setDetailTab(tab)}
            variant="fullWidth"
            className="detail-tabs"
            aria-label={m.detailSections}
          >
            {detailTabs.map((tab) => (
              <Tab
                key={tab}
                value={tab}
                id={'detail-tab-' + tab}
                aria-controls={'detail-panel-' + tab}
                label={
                  tab === 'summary'
                    ? m.detailSummary
                    : tab === 'evidence'
                      ? m.detailEvidence
                      : m.detailMore
                }
              />
            ))}
          </Tabs>
          <DialogContent
            className="detail-scroll"
            key={detailKey + ':' + detailTab}
          >
            {detailTabs.map((tab) => (
              <div
                key={tab}
                role="tabpanel"
                id={'detail-panel-' + tab}
                aria-labelledby={'detail-tab-' + tab}
                hidden={detailTab !== tab}
                tabIndex={0}
              >
                {detailTab === tab &&
                  (!detailsReady ? (
                    loading
                  ) : tab === 'summary' ? (
                    summaryBody()
                  ) : tab === 'evidence' ? (
                    <DetailEvidence
                      data={data}
                      m={m}
                      navigation={navigation}
                      tools={tools}
                      node={node}
                      edge={edge}
                      selected={selected}
                    />
                  ) : (
                    moreBody()
                  ))}
              </div>
            ))}
          </DialogContent>
          {stepNavigation()}
        </>
      )}
    </Dialog>
  );
}
