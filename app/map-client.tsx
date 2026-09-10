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
  DialogActions,
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
  BookOpen,
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
import { glossaryIndex, glossarySegments } from '@/lib/glossary-text.mjs';
import {
  nodeReferenceIndex,
  nodeReferenceSegments,
} from '@/lib/node-reference-text.mjs';
import TreeMap from './tree-map';
import MapTour from './map-tour';
import { tourStops } from '@/lib/map-tour';
import {
  detailTabs,
  libraryPanels,
  type DetailTab,
} from '@/lib/map-navigation';
import { useMapNavigation } from './use-map-navigation';
import type { Panel } from './reading-panels';
const ReadingPanels = lazy(() => import('./reading-panels'));

const REPO = 'https://github.com/mizkun/ai-safety-map';
const panels = libraryPanels;

export default function MapClient({ site }: { site: SiteContent }) {
  const navigation = useMapNavigation(site);
  const {
    locale,
    view,
    expanded,
    panel,
    term: termId,
    guide: showGuide,
  } = navigation.state;
  const [detailContent, setDetailContent] = useState<
    Partial<SiteContent['content']>
  >({});
  const contents = { ...site.content, ...detailContent };
  const data = contents[locale] || contents.ja;
  const m = messages[locale];
  const alternateLocale = site.locales.find(
    (option) => option.enabled && option.code !== locale,
  );
  const selected = navigation.state.detail?.id || null;
  const mode = navigation.state.detail?.kind || 'node';
  const detailKey = mode + ':' + selected;
  const detailTab = navigation.state.detail?.tab || 'summary';
  const [tourHeight, setTourHeight] = useState(320);
  const stops = useMemo(() => tourStops(data), [data]);
  const tour = navigation.state.tour
    ? {
        index: stops.findIndex((s) => s.key === navigation.state.tour?.step),
        focus: navigation.state.tour.focus,
      }
    : null;
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
  function navigate(
    map: string,
    id?: string,
    nextMode: 'node' | 'edge' = 'node',
  ) {
    const isPanel = panels.includes(map as Panel);
    setMenuAnchor(null);
    navigation.go((previous) => ({
      ...previous,
      view: isPanel ? previous.view : map,
      expanded: isPanel || previous.view === map ? previous.expanded : false,
      tour: isPanel || previous.view === map ? previous.tour : null,
      panel: isPanel ? (map as Panel) : null,
      detail: id ? { kind: nextMode, id, tab: 'summary' } : null,
      term: null,
      guide: false,
      research: null,
      questions: [],
    }));
  }
  function changeLocale(next: Locale) {
    if (!site.content[next]) return;
    setLoadError(false);
    navigation.go({ locale: next });
  }
  function openNode(id: string, map?: string) {
    navigate(map || view, id);
  }
  function openEdge(id: string) {
    navigate(view, id, 'edge');
  }
  function selectRoute(id: string) {
    setFocusRequest(null);
    navigation.go({
      view: id,
      tour: null,
      expanded: false,
      detail: null,
      panel: null,
      term: null,
      guide: false,
    });
  }
  function moveTour(index: number) {
    const target = stops[index];
    if (!target) return;
    navigation.go({
      view: target.view,
      tour: { step: target.key, focus: null },
      expanded: false,
      detail: null,
      panel: null,
      term: null,
      guide: false,
      welcome: false,
    });
  }
  function startTour() {
    moveTour(0);
  }
  function openTerm(id: string) {
    navigation.go({ term: id, guide: false });
  }
  function setDetailTab(tab: DetailTab) {
    navigation.go((previous) =>
      previous.detail
        ? { ...previous, detail: { ...previous.detail, tab } }
        : previous,
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
                setFocusRequest({ id: node.id, serial: Date.now() });
                navigation.go({ tour: null, detail: null });
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
            onClick={() => selectRoute('overview')}
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
                  if (value) navigation.go({ expanded: value === 'all' });
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
        navigationState={navigation.state}
        restoration={navigation.restoration}
        onCameraChange={navigation.checkpoint}
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
        onTerm={openTerm}
        onGuide={() => navigation.go({ guide: true })}
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
          onClose={() => navigation.go({ tour: null })}
          onFocus={(focus) =>
            navigation.go((previous) => ({
              ...previous,
              tour: previous.tour ? { ...previous.tour, focus } : null,
            }))
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
            navigation.go({ guide: true });
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
        open={navigation.state.welcome}
        onClose={() => navigation.close('welcome')}
        fullWidth
        maxWidth="xs"
        aria-labelledby="welcome-title"
        slotProps={{ paper: { className: 'welcome-dialog' } }}
      >
        <DialogTitle className="modal-heading" id="welcome-title">
          <span>{m.welcomeTitle}</span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('welcome')}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {[
            {
              Icon: Waypoints,
              title: m.welcomeMapTitle,
              text: m.welcomeMapText,
            },
            { Icon: Play, title: m.welcomeTourTitle, text: m.welcomeTourText },
            {
              Icon: BookOpen,
              title: m.welcomeReadTitle,
              text: m.welcomeReadText,
            },
          ].map(({ Icon, title, text }) => {
            return (
              <div className="welcome-feature" key={title as string}>
                <Icon size={22} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigation.close('welcome')}>
            {m.welcomeBrowse}
          </Button>
          <Button
            variant="contained"
            startIcon={<Play size={16} />}
            onClick={() => {
              navigation.go({ welcome: false }, true);
              startTour();
            }}
          >
            {m.welcomeStart}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showGuide}
        onClose={() => navigation.close('guide')}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="modal-heading">
          <span>{m.parallelGuide}</span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('guide')}
          >
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
        onClose={() => navigation.close('panel')}
        fullWidth
        maxWidth="md"
        className="library-dialog"
      >
        <DialogTitle className="modal-heading">
          <span>{panel ? m[panel] : m.library}</span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('panel')}
          >
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
                    onTerm={openTerm}
                    search={navigation.state.search}
                    onSearch={(search) => navigation.go({ search }, true)}
                  />
                </Suspense>
              )}
        </DialogContent>
      </Dialog>
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
        onClose={() => navigation.close('term')}
        fullWidth
        maxWidth="sm"
        className="term-dialog"
      >
        <DialogTitle className="modal-heading">
          <span className="term-heading">
            {historyBackButton()}
            {term?.name || m.definition}
          </span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('term')}
          >
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
