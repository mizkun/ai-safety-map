'use client';
import type { SiteContent } from '@/lib/content-types';
import { messages, type Locale } from '@/lib/i18n';
import { libraryPanels } from '@/lib/map-navigation';
import { tourStops } from '@/lib/map-tour';
import { Box, ButtonBase, Fab } from '@mui/material';
import { Play } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import MapHeader from './map-header';
import MapTour from './map-tour';
import OnboardingDialogs from './onboarding-dialogs';
import type { Panel } from './reading-panels';
import ContentLoading from './reading/content-loading';
import CurrentDialog from './reading/current-dialog';
import DetailDialog from './reading/detail-dialog';
import LibraryDialog from './reading/library-dialog';
import TermDialog from './reading/term-dialog';
import { useReadingTools } from './reading/use-reading-tools';
import TreeMap from './tree-map';
import { useDetailContent } from './use-detail-content';
import { useMapNavigation } from './use-map-navigation';
import { useReviewDay } from './use-review-day';

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
  const needsDetails = Boolean(
    navigation.state.detail ||
    panel ||
    termId ||
    navigation.state.tour ||
    navigation.state.current,
  );
  const detailContent = useDetailContent(site, locale, needsDetails);
  const { data, ready: detailsReady } = detailContent;
  const m = messages[locale];
  const alternateLocale = site.locales.find(
    (option) => option.enabled && option.code !== locale,
  );
  const selected = navigation.state.detail?.id || null;

  const [tourHeight, setTourHeight] = useState(320);
  const stops = useMemo(() => tourStops(data), [data]);
  const tour = navigation.state.tour
    ? {
        index: stops.findIndex((s) => s.key === navigation.state.tour?.step),
        focus: navigation.state.tour.focus,
      }
    : null;
  const stop = tour ? stops[tour.index] || stops[0] : null;
  const [focusRequest, setFocusRequest] = useState<{
    id: string;
    serial: number;
  } | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const today = useReviewDay(data.asOf);
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
    detailContent.clearError();
    navigation.go({ locale: next });
  }
  function openNode(id: string, map?: string) {
    navigate(map || view, id);
  }
  function openEvidence(id: string) {
    navigation.go({
      detail: { kind: 'node', id, tab: 'evidence' },
      current: false,
      term: null,
      research: null,
      questions: [],
    });
  }
  function openCurrent() {
    setMenuAnchor(null);
    navigation.go({
      current: true,
      guide: false,
      welcome: false,
    });
  }
  function currentMap(route: string, id: string) {
    navigation.go({
      view: route,
      lens: 'current',
      current: false,
      expanded: false,
      tour: null,
      detail: null,
      term: null,
      panel: null,
    });
    setFocusRequest({ id, serial: Date.now() });
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
    setFocusRequest(null);
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

  const graph = data.graphs[view];
  const tools = useReadingTools({
    data,
    m,
    navigation,
    today,
    openNode,
    openTerm,
  });
  const { richText } = tools;
  const reading = {
    data,
    m,
    navigation,
    tools,
    detailsReady,
    loading: (
      <ContentLoading
        m={m}
        error={detailContent.error}
        onRetry={detailContent.retry}
      />
    ),
  };
  return (
    <Box
      component="main"
      className={
        'map-app' +
        (tour ? ' has-tour' : '') +
        (navigation.state.lens ? ' has-current' : '')
      }
      style={{ '--tour-panel-height': tourHeight + 'px' } as CSSProperties}
    >
      <MapHeader
        navigation={navigation}
        m={m}
        alternateLocale={alternateLocale}
        menuAnchor={menuAnchor}
        onMenuAnchor={setMenuAnchor}
        selectRoute={selectRoute}
        openCurrent={openCurrent}
        changeLocale={changeLocale}
        navigate={navigate}
      />
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
                edge: stop.edge,
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
        onEvidence={openEvidence}
        onCurrent={openCurrent}
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
          onReadEdge={openEdge}
          stops={stops}
          index={tour.index}
          ready={detailsReady}
          keyboardEnabled={
            !selected &&
            !panel &&
            !termId &&
            !menuAnchor &&
            !showGuide &&
            !navigation.state.current
          }
          loading={
            <ContentLoading
              m={m}
              error={detailContent.error}
              onRetry={detailContent.retry}
            />
          }
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

      <CurrentDialog
        {...reading}
        currentMap={currentMap}
        openEvidence={openEvidence}
      />
      <OnboardingDialogs m={m} navigation={navigation} startTour={startTour} />

      <LibraryDialog
        {...reading}
        openNode={openNode}
        openTerm={openTerm}
        navigate={navigate}
      />
      <DetailDialog
        {...reading}
        today={today}
        openNode={openNode}
        openTerm={openTerm}
        openEdge={openEdge}
        navigate={navigate}
        onShowNode={(id) => {
          setFocusRequest({ id, serial: Date.now() });
          navigation.go({ tour: null, detail: null });
        }}
      />
      <TermDialog {...reading} />
    </Box>
  );
}
