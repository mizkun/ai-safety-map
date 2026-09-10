'use client';
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  GitBranch,
  Layers3,
  Menu as MenuIcon,
  Play,
  ShieldCheck,
  Waypoints,
  X,
} from 'lucide-react';
import type { Question, Review, SiteContent } from '@/lib/content-types';
import { currentReviewDay, reviewStatus } from '@/lib/freshness.mjs';
import { messages, formatMessage, type Locale } from '@/lib/i18n';
import { currentEdgeId } from '@/lib/legacy-links.mjs';
import { glossaryIndex, glossarySegments } from '@/lib/glossary-text.mjs';
import {
  nodeReferenceIndex,
  nodeReferenceSegments,
} from '@/lib/node-reference-text.mjs';
import TreeMap from './tree-map';
import MapTour from './map-tour';
import { tourStops } from '@/lib/map-tour';
import type { Panel } from './reading-panels';
const ReadingPanels = lazy(() => import('./reading-panels'));

const REPO = 'https://github.com/mizkun/ai-safety-map';
const panels: Panel[] = ['about', 'glossary', 'history', 'sources'];
const detailTabs = ['summary', 'evidence', 'more'] as const;
type DetailTab = (typeof detailTabs)[number];

export default function MapClient({ site }: { site: SiteContent }) {
  const [locale, setLocale] = useState<Locale>('ja');
  const [detailContent, setDetailContent] = useState<
    Partial<SiteContent['content']>
  >({});
  const contents = { ...site.content, ...detailContent };
  const data = contents[locale] || contents.ja;
  const m = messages[locale];
  const alternateLocale = site.locales.find(
    (option) => option.enabled && option.code !== locale,
  );
  const [view, setView] = useState('overview');
  const [expanded, setExpanded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<'node' | 'edge'>('node');
  const [detailReading, setDetailReading] = useState<{
    key: string;
    tab: DetailTab;
  } | null>(null);
  const detailKey = mode + ':' + selected;
  const detailTab =
    detailReading?.key === detailKey ? detailReading.tab : 'summary';
  const [panel, setPanel] = useState<Panel | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [tour, setTour] = useState<{
    index: number;
    focus: string | null;
  } | null>(null);
  const [tourHeight, setTourHeight] = useState(320);
  const stops = useMemo(() => tourStops(data), [data]);
  const stop = tour ? stops[tour.index] || stops[0] : null;
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const detailsUrl = site.detailsUrls?.[locale];
  const detailsReady = !detailsUrl || Boolean(detailContent[locale]);
  const needsDetails = Boolean(selected || panel || termId || tour);
  useEffect(() => {
    if (!needsDetails || detailsReady || !detailsUrl || loadError) return;
    const controller = new AbortController();
    fetch(detailsUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Content fetch failed');
        return response.json();
      })
      .then((content: SiteContent['content']) => {
        if (!content[locale]?.nodes?.M2c1?.body?.['概要'])
          throw new Error('Invalid content package');
        setDetailContent((previous) => ({
          ...previous,
          [locale]: content[locale],
        }));
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadError(true);
      });
    return () => controller.abort();
  }, [needsDetails, detailsReady, detailsUrl, locale, loadAttempt, loadError]);
  const [focusRequest, setFocusRequest] = useState<{
    id: string;
    serial: number;
  } | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [today, setToday] = useState(data.asOf);
  useEffect(() => {
    const update = () => setToday(currentReviewDay());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    const read = () => {
      setTour(null);
      setExpanded(false);
      setShowGuide(false);
      setDetailReading(null);
      const q = new URLSearchParams(location.hash.slice(1));
      const requested = q.get('lang');
      const language = requested === 'en' && site.content.en ? 'en' : 'ja';
      setLocale(language);
      if (requested === 'en' && language !== 'en') {
        q.set('lang', 'ja');
        history.replaceState(null, '', '#' + q.toString());
      }
      const content = site.content[language]!;
      const map = q.get('map') || 'overview';
      const id = q.get('node');
      const requestedEdge = q.get('edge');
      const edge = requestedEdge ? currentEdgeId(requestedEdge) : null;
      if (edge && edge !== requestedEdge) {
        q.set('edge', edge);
        history.replaceState(null, '', '#' + q.toString());
      }
      setView(content.graphs[map] ? map : 'overview');
      setPanel(
        panels.includes(map as Panel) && !id && !edge ? (map as Panel) : null,
      );
      if (id && content.nodes[id]) {
        setSelected(id);
        setMode('node');
      } else if (edge && content.edges[edge]) {
        setSelected(edge);
        setMode('edge');
      } else setSelected(null);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, [site]);
  function navigate(
    map: string,
    id?: string,
    nextMode: 'node' | 'edge' = 'node',
    replace = false,
  ) {
    const isPanel = panels.includes(map as Panel);
    if (!isPanel && map !== view) setExpanded(false);
    if (!isPanel) setView(data.graphs[map] ? map : 'overview');
    setPanel(isPanel && !id ? (map as Panel) : null);
    setSelected(id || null);
    setMode(nextMode);
    setDetailReading(null);
    setMenuAnchor(null);
    const q = new URLSearchParams({
      lang: locale,
      map,
      ...(id ? { [nextMode]: id } : {}),
    });
    const hash = '#' + q.toString();
    if (location.hash !== hash) {
      if (replace) history.replaceState(null, '', hash);
      else history.pushState(null, '', hash);
    }
  }
  function changeLocale(next: Locale) {
    if (!site.content[next]) return;
    setLocale(next);
    setLoadError(false);
    const q = new URLSearchParams(location.hash.slice(1));
    q.set('lang', next);
    history.replaceState(null, '', '#' + q.toString());
  }
  function openNode(id: string, map?: string) {
    if (map && map !== view) setTour(null);
    navigate(map || view, id);
  }
  function openEdge(id: string) {
    navigate(view, id, 'edge');
  }
  function selectRoute(id: string) {
    setTour(null);
    setFocusRequest(null);
    navigate(id);
  }
  function moveTour(index: number) {
    const target = stops[index];
    if (!target) return;
    setTour({ index, focus: null });
    navigate(target.view, undefined, 'node', true);
  }
  function startTour() {
    setExpanded(false);
    setTour({ index: 0, focus: null });
    navigate('overview');
  }
  function loadingBody() {
    return (
      <output className="content-loading">
        {loadError ? (
          <>
            <span>{m.loadError}</span>
            <Button
              onClick={() => {
                setLoadError(false);
                setLoadAttempt((n) => n + 1);
              }}
            >
              {m.retry}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {m.refreshPage}
            </Button>
          </>
        ) : (
          <>
            <CircularProgress size={24} />
            <span>{m.loading}</span>
          </>
        )}
      </output>
    );
  }
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
      return id ? (
        <ButtonBase
          component="button"
          disableRipple
          className="term-inline"
          key={i}
          onClick={() => setTermId(id)}
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
  function questions(items: Question[], prefix: string): ReactNode {
    return items.map((q, i) => (
      <Accordion disableGutters key={prefix + i} className="question">
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
  const node = mode === 'node' && selected ? data.nodes[selected] : undefined;
  const edge = mode === 'edge' && selected ? data.edges[selected] : undefined;
  const term = termId ? data.glossary[termId] : undefined;
  const graph = data.graphs[view];
  const nodeIndex = node ? (graph?.nodes.indexOf(node.id) ?? -1) : -1;
  function parentView(parent: string) {
    return (
      Object.values(data.graphs).find((g) => g.nodes.includes(parent))?.id ||
      'overview'
    );
  }
  function detailSection(
    title: string,
    body: ReactNode,
    icon?: ReactNode,
    extraClass = '',
  ) {
    return (
      <section className={'detail-section ' + extraClass}>
        <h3>
          {icon}
          {title}
        </h3>
        {body}
      </section>
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
                setTour(null);
                setFocusRequest({ id: node.id, serial: Date.now() });
                navigate(view);
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
  function evidenceBody() {
    const item = node || edge;
    if (!item) return null;
    const cited = new Set(item.research.map((id) => data.research[id].source));
    const extraSources = item.sources.filter((id) => !cited.has(id));
    return (
      <>
        {node && (
          <Chip
            className="evidence-kind"
            size="small"
            label={
              {
                observed: m.observed,
                limited: m.limited,
                hypothesis: m.hypothesis,
                definition: m.definitionState,
              }[node.status]
            }
          />
        )}
        <p className="lead-copy">
          {richText(node ? node.body['現在の状況'] : edge!.current)}
        </p>
        {edge && <p className="evidence-basis">{richText(edge.basis)}</p>}
        {item.research.map((id, i) => {
          const r = data.research[id];
          return (
            <Accordion
              key={id}
              defaultExpanded={i === 0}
              disableGutters
              className="research-card"
              onChange={(event, isOpen) => {
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
                  onClick={() => setTermId(id)}
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
          <Button onClick={() => navigate(view)}>{m.returnMap}</Button>
        )}
      </nav>
    );
  }
  return (
    <Box
      component="main"
      className={'map-app' + (tour ? ' has-tour' : '')}
      style={{ '--tour-panel-height': tourHeight + 'px' } as CSSProperties}
    >
      <div className="ambient-shape ambient-one" />
      <div className="ambient-shape ambient-two" />
      <div className="ambient-shape ambient-three" />
      <header className="app-header">
        <Paper elevation={0} className="brand-pill glass">
          <ButtonBase
            aria-label={m.overview}
            onClick={() => {
              setTour(null);
              setExpanded(false);
              navigate('overview');
            }}
          >
            <Waypoints size={21} />
            <span>AI SAFETY MAP</span>
          </ButtonBase>
        </Paper>
        <Paper elevation={0} className="header-tools glass">
          {view === 'overview' && !tour && (
            <>
              <ToggleButtonGroup
                className="header-scope"
                size="small"
                exclusive
                value={expanded ? 'all' : 'summary'}
                onChange={(_, value: string | null) => {
                  if (value) setExpanded(value === 'all');
                }}
                aria-label={m.displayScope}
              >
                <ToggleButton value="summary">{m.summaryView}</ToggleButton>
                <ToggleButton value="all">{m.allElements}</ToggleButton>
              </ToggleButtonGroup>
              <span className="header-divider" aria-hidden="true" />
            </>
          )}
          {alternateLocale && (
            <Tooltip title={alternateLocale.name}>
              <ButtonBase
                className="language-switch"
                aria-label={alternateLocale.name}
                lang={alternateLocale.code}
                onClick={() => changeLocale(alternateLocale.code)}
              >
                {alternateLocale.code === 'ja' ? 'JP' : 'EN'}
              </ButtonBase>
            </Tooltip>
          )}
          <Tooltip title={m.library}>
            <IconButton
              aria-label={m.library}
              aria-controls={menuAnchor ? 'library-menu' : undefined}
              aria-haspopup="menu"
              aria-expanded={Boolean(menuAnchor)}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MenuIcon size={19} />
            </IconButton>
          </Tooltip>
        </Paper>
      </header>
      {!tour && (
        <Fab className="tour-launch" variant="extended" onClick={startTour}>
          <Play size={18} aria-hidden="true" />
          {m.tour}
        </Fab>
      )}
      {view !== 'overview' && !tour && (
        <nav className="map-breadcrumb" aria-label={m.breadcrumb}>
          <ButtonBase onClick={() => selectRoute('overview')}>
            {m.overviewLabel}
          </ButtonBase>
          <span aria-hidden="true">›</span>
          <strong aria-current="page">
            {data.routes.find((r) => r.id === view)?.shortTitle || graph?.title}
          </strong>
        </nav>
      )}
      <TreeMap
        key={view}
        focusRequest={focusRequest}
        tourFocus={
          stop
            ? {
                key: stop.key + ':' + (tour?.focus || ''),
                nodes: stop.nodes,
                detail: stop.kind === 'node',
                focus: tour?.focus || null,
              }
            : null
        }
        data={site.content[locale] || site.content.ja}
        view={view}
        expanded={expanded}
        today={today}
        messages={m}
        selected={selected}
        onNode={openNode}
        onEdge={openEdge}
        onRoute={(id) => {
          if (tour) moveTour(stops.findIndex((s) => s.view === id));
          else selectRoute(id);
        }}
        onTerm={setTermId}
        onGuide={() => setShowGuide(true)}
      />
      {tour && (
        <MapTour
          data={data}
          m={m}
          stops={stops}
          index={tour.index}
          ready={detailsReady}
          keyboardEnabled={
            !selected && !panel && !termId && !menuAnchor && !showGuide
          }
          loading={loadingBody()}
          focus={tour.focus}
          onMove={moveTour}
          onClose={() => setTour(null)}
          onFocus={(focus) =>
            setTour((current) => (current ? { ...current, focus } : null))
          }
          onRead={openNode}
          onHeight={setTourHeight}
          richText={richText}
        />
      )}
      <Menu
        id="library-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setShowGuide(true);
          }}
        >
          {m.parallelGuide}
        </MenuItem>
        {panels.map((p) => (
          <MenuItem key={p} onClick={() => navigate(p)}>
            <span>{m[p]}</span>
          </MenuItem>
        ))}
        <MenuItem
          component="a"
          href={REPO}
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuAnchor(null)}
        >
          <GitBranch size={16} />
          <span>{m.contribute}</span>
          <ArrowUpRight size={13} />
        </MenuItem>
      </Menu>
      <Dialog
        open={showGuide}
        onClose={() => setShowGuide(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="modal-heading">
          <span>{m.parallelGuide}</span>
          <IconButton aria-label={m.close} onClick={() => setShowGuide(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="parallel-guide">
          <p>
            <strong>AND · {m.joint}</strong>
            {m.jointHelp}
          </p>
          <p>
            <strong>OR · {m.alternative}</strong>
            {m.alternativeHelp}
          </p>
          <p>{m.parallelHelp}</p>
          <p>
            <strong>
              {m.influence} / {m.mitigation}
            </strong>
            {m.influenceHelp}
          </p>
          <p>{m.fullMapHelp}</p>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(panel)}
        onClose={() => navigate(view)}
        fullWidth
        maxWidth="md"
        className="library-dialog"
      >
        <DialogTitle className="modal-heading">
          <span>{panel ? m[panel] : m.library}</span>
          <IconButton aria-label={m.close} onClick={() => navigate(view)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Tabs
          value={panel || 'about'}
          onChange={(_, value: Panel) => navigate(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className="library-tabs"
        >
          {panels.map((p) => (
            <Tab key={p} value={p} label={m[p]} />
          ))}
        </Tabs>
        <DialogContent dividers>
          {!detailsReady
            ? loadingBody()
            : panel && (
                <Suspense fallback={loadingBody()}>
                  <ReadingPanels
                    panel={panel}
                    data={data}
                    m={m}
                    source={source}
                    onNode={openNode}
                    onTerm={setTermId}
                  />
                </Suspense>
              )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(node || edge)}
        onClose={() => navigate(view)}
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
                  {node && <span className="node-id">{node.id}</span>}
                  {node ? m.explanation : m.connection}
                </span>
                <IconButton aria-label={m.close} onClick={() => navigate(view)}>
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
                  onClick={() =>
                    setDetailReading({ key: detailKey, tab: 'evidence' })
                  }
                >
                  {m.due}
                </Button>
              )}
            </div>
            <Tabs
              value={detailTab}
              onChange={(_, tab: DetailTab) =>
                setDetailReading({ key: detailKey, tab })
              }
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
                    (!detailsReady
                      ? loadingBody()
                      : tab === 'summary'
                        ? summaryBody()
                        : tab === 'evidence'
                          ? evidenceBody()
                          : moreBody())}
                </div>
              ))}
            </DialogContent>
            {stepNavigation()}
          </>
        )}
      </Dialog>
      <Dialog
        open={Boolean(term)}
        onClose={() => setTermId(null)}
        fullWidth
        maxWidth="sm"
        className="term-dialog"
      >
        <DialogTitle className="modal-heading">
          <span>{term?.name || m.definition}</span>
          <IconButton aria-label={m.close} onClick={() => setTermId(null)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!detailsReady
            ? loadingBody()
            : term && (
                <div className="term-content" key={termId}>
                  <p className="lead-copy">{richText(term.definition)}</p>
                  {term.example && (
                    <div className="example-block">
                      <p>{richText(term.example)}</p>
                    </div>
                  )}
                  <div className="limit-block">
                    <h3>{m.caution}</h3>
                    <p>{richText(term.limit)}</p>
                  </div>
                  {term.sources.map((id) => (
                    <div key={id}>{source(id)}</div>
                  ))}
                </div>
              )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
