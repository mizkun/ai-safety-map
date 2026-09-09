'use client';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  GitBranch,
  GitPullRequest,
  Globe2,
  Info,
  Layers3,
  Menu as MenuIcon,
  ShieldCheck,
  Waypoints,
  X,
} from 'lucide-react';
import type { Question, Review, SiteContent } from '@/lib/content-types';
import { currentReviewDay, reviewStatus } from '@/lib/freshness.mjs';
import { messages, formatMessage, type Locale } from '@/lib/i18n';
import { routeColors } from '@/lib/tree-layout';
import TreeMap from './tree-map';
import ReadingPanels, { type Panel } from './reading-panels';

const REPO = 'https://github.com/mizkun/ai-safety-map';
const panels: Panel[] = [
  'about',
  'glossary',
  'news',
  'history',
  'freshness',
  'sources',
];

export default function MapClient({ site }: { site: SiteContent }) {
  const [locale, setLocale] = useState<Locale>('ja');
  const data = site.content[locale] || site.content.ja;
  const m = messages[locale];
  const [view, setView] = useState('overview');
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<'node' | 'edge'>('node');
  const [panel, setPanel] = useState<Panel | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [routePicker, setRoutePicker] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [languageAnchor, setLanguageAnchor] = useState<HTMLElement | null>(
    null,
  );
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
      const id = q.get('node'),
        edge = q.get('edge');
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
  ) {
    const isPanel = panels.includes(map as Panel);
    if (!isPanel) setView(data.graphs[map] ? map : 'overview');
    setPanel(isPanel && !id ? (map as Panel) : null);
    setSelected(id || null);
    setMode(nextMode);
    setMenuAnchor(null);
    const q = new URLSearchParams({
      lang: locale,
      map,
      ...(id ? { [nextMode]: id } : {}),
    });
    const hash = '#' + q.toString();
    if (location.hash !== hash) history.pushState(null, '', hash);
  }
  function changeLocale(next: Locale) {
    if (!site.content[next]) return;
    setLocale(next);
    setLanguageAnchor(null);
    const q = new URLSearchParams(location.hash.slice(1));
    q.set('lang', next);
    history.replaceState(null, '', '#' + q.toString());
  }
  function openNode(id: string, map?: string) {
    navigate(map || view, id);
  }
  function openEdge(id: string) {
    navigate(view, id, 'edge');
  }
  function selectRoute(id: string) {
    setRoutePicker(false);
    navigate(id, data.graphs[id].nodes[0]);
  }
  const termIndex = useMemo(() => {
    const aliases = new Map<string, string>();
    for (const [id, t] of Object.entries(data.glossary))
      for (const alias of t.aliases) aliases.set(alias.toLowerCase(), id);
    const escaped = [...aliases.keys()]
      .sort((a, b) => b.length - a.length)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return {
      aliases,
      pattern: new RegExp('(' + escaped.join('|') + ')', 'gi'),
    };
  }, [data.glossary]);
  function richText(text: string): ReactNode {
    return text.split(termIndex.pattern).map((part, i) => {
      const id = termIndex.aliases.get(part.toLowerCase());
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
        part
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
          <Tooltip title={review.reason}>
            <Info size={14} />
          </Tooltip>
        </div>
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
  const dueCount = useMemo(
    () =>
      [...Object.values(data.nodes), ...Object.values(data.edges)].filter(
        (n) => reviewStatus(n.review, today).state === 'due',
      ).length,
    [data, today],
  );
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
  function nodeBody() {
    if (!node) return null;
    return (
      <>
        {reviewNote(node.review)}
        <p className="lead-copy">{richText(node.body['ひとことで'])}</p>
        {!!node.terms?.length && (
          <div className="chip-links">
            {node.terms.map((id) => (
              <Chip
                key={id}
                size="small"
                icon={<BookOpen size={13} />}
                label={data.glossary[id].name}
                onClick={() => setTermId(id)}
              />
            ))}
          </div>
        )}
        {node.body['たとえば'] && (
          <div className="example-block">
            <span>{m.example}</span>
            <p>{richText(node.body['たとえば'])}</p>
          </div>
        )}
        {node.subgraph && (
          <Button
            className="explore-button"
            fullWidth
            variant="outlined"
            startIcon={<Layers3 size={18} />}
            endIcon={<ArrowRight size={17} />}
            onClick={() =>
              navigate(node.subgraph!, data.graphs[node.subgraph!].nodes[0])
            }
          >
            {m.explore}
          </Button>
        )}
        {detailSection(
          m.whyNext,
          <p>{richText(node.body['次へ進むには'])}</p>,
          <ArrowRight size={17} />,
        )}
        {detailSection(
          m.evidence,
          <>
            {node.evidence.map((e, i) => (
              <article className="evidence-block" key={i}>
                <Chip size="small" label={e.kind} />
                <p>{richText(e.text)}</p>
                {source(e.src)}
              </article>
            ))}
          </>,
          <BookOpen size={17} />,
        )}
        {detailSection(
          m.uncertainty,
          <p>{richText(node.body['残る壁と不確実性'])}</p>,
          undefined,
          'limit-block',
        )}
        {detailSection(
          m.safeguards,
          <p>{richText(node.body['進行を止めるには'])}</p>,
          <ShieldCheck size={17} />,
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
        {!!node.related.length && (
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
          </div>
        )}
        <Accordion disableGutters className="source-accordion">
          <AccordionSummary expandIcon={<ChevronDown size={18} />}>
            {m.nodeSources}
          </AccordionSummary>
          <AccordionDetails>
            {[
              ...new Set([...node.sources, ...node.evidence.map((e) => e.src)]),
            ].map((id) => (
              <div key={id}>{source(id)}</div>
            ))}
          </AccordionDetails>
        </Accordion>
      </>
    );
  }
  function edgeBody() {
    if (!edge) return null;
    return (
      <>
        {reviewNote(edge.review)}
        <div className="edge-context">
          <Button onClick={() => openNode(edge.from)}>
            {data.nodes[edge.from].title}
          </Button>
          <ArrowDown size={18} />
          <Button onClick={() => openNode(edge.to)}>
            {data.nodes[edge.to].title}
          </Button>
        </div>
        <Chip size="small" label={edge.basis} />
        <p className="lead-copy">{richText(edge.explanation)}</p>
        {detailSection(
          m.additionalConditions,
          <ul>
            {edge.conditions.map((c) => (
              <li key={c}>{richText(c)}</li>
            ))}
          </ul>,
        )}
        {detailSection(
          m.limitations,
          <p>{richText(edge.limitation)}</p>,
          undefined,
          'limit-block',
        )}
        {detailSection(
          m.safeguards,
          <p>{richText(edge.safeguards)}</p>,
          <ShieldCheck size={17} />,
        )}
        <div className="source-list">
          {edge.sources.map((id) => (
            <div key={id}>{source(id)}</div>
          ))}
        </div>
      </>
    );
  }
  function stepNavigation() {
    if (edge)
      return (
        <nav className="step-navigation" aria-label={m.connection}>
          <Button
            onClick={() => openNode(edge.from)}
            startIcon={<ArrowLeft size={15} />}
          >
            {m.previous}
          </Button>
          <span>{m.connection}</span>
          <Button
            onClick={() => openNode(edge.to)}
            endIcon={<ArrowRight size={15} />}
          >
            {m.next}
          </Button>
        </nav>
      );
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
    <Box component="main" className="map-app">
      <div className="ambient-shape ambient-one" />
      <div className="ambient-shape ambient-two" />
      <div className="ambient-shape ambient-three" />
      <header className="app-header">
        <Paper elevation={0} className="brand-pill glass">
          <ButtonBase
            aria-label={m.overview}
            onClick={() => navigate('overview')}
          >
            <Waypoints size={21} />
            <span>AI SAFETY MAP</span>
          </ButtonBase>
        </Paper>
        <Paper elevation={0} className="header-tools glass">
          <Tooltip title={m.about}>
            <IconButton aria-label={m.about} onClick={() => navigate('about')}>
              <Info size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title={m.language}>
            <IconButton
              aria-label={m.language}
              aria-controls={languageAnchor ? 'language-menu' : undefined}
              aria-haspopup="menu"
              onClick={(e) => setLanguageAnchor(e.currentTarget)}
            >
              <Globe2 size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title={m.library}>
            <IconButton
              aria-label={m.library}
              aria-controls={menuAnchor ? 'library-menu' : undefined}
              aria-haspopup="menu"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <Badge color="warning" variant="dot" invisible={!dueCount}>
                <MenuIcon size={19} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Paper>
      </header>
      {view !== 'overview' && (
        <Paper elevation={0} className="breadcrumb-bar glass">
          <IconButton
            aria-label={m.back}
            onClick={() =>
              graph?.parent
                ? navigate(parentView(graph.parent), graph.parent)
                : navigate('overview')
            }
          >
            <ArrowLeft size={17} />
          </IconButton>
          <span>{graph?.title}</span>
        </Paper>
      )}
      <TreeMap
        data={data}
        view={view}
        today={today}
        messages={m}
        selected={selected}
        onNode={openNode}
        onEdge={openEdge}
        onRoute={selectRoute}
        onChoose={() => setRoutePicker(true)}
      />
      <Menu
        id="library-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {panels.map((p) => (
          <MenuItem key={p} onClick={() => navigate(p)}>
            <span>{m[p]}</span>
            {p === 'freshness' && dueCount > 0 && (
              <Chip size="small" label={dueCount} className="menu-count" />
            )}
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
      <Menu
        id="language-menu"
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={() => setLanguageAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {site.locales.map((l) => (
          <MenuItem
            key={l.code}
            disabled={!l.enabled}
            onClick={() => changeLocale(l.code)}
          >
            <div>
              <span>{l.name}</span>
              {!l.enabled && (
                <small className="language-pending">{m.comingSoon}</small>
              )}
            </div>
            {locale === l.code && <Check size={15} />}
          </MenuItem>
        ))}
      </Menu>
      <Dialog
        open={routePicker}
        onClose={() => setRoutePicker(false)}
        fullWidth
        maxWidth="sm"
        className="route-dialog"
      >
        <DialogTitle className="modal-heading">
          <span>{m.routes}</span>
          <IconButton
            aria-label={m.close}
            onClick={() => setRoutePicker(false)}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="route-picker">
            {data.routes.map((r) => (
              <ButtonBase
                className="route-option"
                key={r.id}
                onClick={() => selectRoute(r.id)}
              >
                <span
                  className="route-option-dot"
                  style={{ background: routeColors[r.id] }}
                />
                <span>{r.shortTitle}</span>
                <ArrowRight size={17} />
              </ButtonBase>
            ))}
          </div>
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
          {panel && (
            <ReadingPanels
              panel={panel}
              data={data}
              m={m}
              today={today}
              richText={richText}
              source={source}
              onNode={openNode}
              onEdge={openEdge}
              onTerm={setTermId}
            />
          )}
        </DialogContent>
      </Dialog>
      <Drawer
        anchor="right"
        open={Boolean(node || edge)}
        onClose={() => navigate(view)}
        slotProps={{
          paper: {
            className: 'detail-drawer',
            role: 'dialog',
            'aria-modal': true,
            'aria-labelledby': 'detail-title',
          },
        }}
      >
        {(node || edge) && (
          <>
            <div className="detail-header">
              <div className="detail-meta">
                <span>
                  {node ? m.explanation : m.connection} · {selected}
                </span>
                <IconButton aria-label={m.close} onClick={() => navigate(view)}>
                  <X size={21} />
                </IconButton>
              </div>
              {graph?.parent && (
                <Button
                  size="small"
                  className="parent-link"
                  startIcon={<ArrowLeft size={13} />}
                  onClick={() =>
                    navigate(parentView(graph.parent!), graph.parent)
                  }
                >
                  {m.returnParent}
                </Button>
              )}
              <Typography
                component="h2"
                id="detail-title"
                className="detail-title"
              >
                {richText(node?.title || edge?.label || '')}
              </Typography>
              {graph && <div className="detail-subtitle">{graph.title}</div>}
            </div>
            <div className="detail-scroll" key={selected}>
              {node ? nodeBody() : edgeBody()}
              <div className="contribute-block">
                <GitPullRequest size={18} />
                <div>
                  <Link
                    href={
                      REPO +
                      '/issues/new?template=correction.yml&title=' +
                      encodeURIComponent(
                        '[' +
                          selected +
                          '] ' +
                          (node?.title || edge?.label || ''),
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
              </div>
            </div>
            {stepNavigation()}
            <div className="detail-footer">{m.permalink}</div>
          </>
        )}
      </Drawer>
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
          {term && (
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
