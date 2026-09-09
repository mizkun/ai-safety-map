'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GitBranch,
  GitPullRequest,
  ShieldCheck,
  Waypoints,
  X,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import type { Content, Question, Graph } from '@/lib/content-types';
const REPO = 'https://github.com/mizkun/ai-safety-map';

export default function MapClient({ data }: { data: Content }) {
  const [view, setView] = useState('overview');
  const [termId, setTermId] = useState<string | null>(null);
  const [termSearch, setTermSearch] = useState('');
  const termIndex = useMemo(() => {
    const aliases = new Map<string, string>();
    for (const [id, term] of Object.entries(data.glossary))
      for (const alias of term.aliases) aliases.set(alias.toLowerCase(), id);
    const escaped = [...aliases.keys()]
      .sort((a, b) => b.length - a.length)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return {
      aliases,
      pattern: new RegExp('(' + escaped.join('|') + ')', 'gi'),
    };
  }, [data.glossary]);
  function richText(value: string) {
    return value.split(termIndex.pattern).map((part, i) => {
      const id = termIndex.aliases.get(part.toLowerCase());
      return id ? (
        <button
          key={i}
          className="term-inline"
          onClick={() => setTermId(id)}
          aria-label={part + 'の意味を開く'}
        >
          {part}
        </button>
      ) : (
        part
      );
    });
  }

  const [selected, setSelected] = useState<string | null>(null);
  const [readMode, setReadMode] = useState<'node' | 'edge'>('node');
  useEffect(() => {
    const read = () => {
      const query = new URLSearchParams(location.hash.slice(1));
      const graph = query.get('map');
      const node = query.get('node');
      const edge = query.get('edge');
      if (
        graph &&
        (data.graphs[graph] ||
          ['overview', 'history', 'sources', 'news', 'glossary'].includes(
            graph,
          ))
      )
        setView(graph);
      if (node && data.nodes[node]) {
        setSelected(node);
        setReadMode('node');
      } else if (edge && data.edges[edge]) {
        setSelected(edge);
        setReadMode('edge');
      } else setSelected(null);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, [data]);
  function navigate(
    graph: string,
    id?: string,
    mode: 'node' | 'edge' = 'node',
  ) {
    setView(graph);
    setSelected(id || null);
    setReadMode(mode);
    const query = new URLSearchParams({
      map: graph,
      ...(id ? { [mode]: id } : {}),
    });
    history.replaceState(null, '', '#' + query.toString());
  }
  function open(id: string, mode: 'node' | 'edge' = 'node') {
    navigate(view, id, mode);
  }
  function Source({ id }: { id: string }) {
    const source = data.sources[id];
    return source ? (
      <a
        className="source-link"
        href={source.url}
        target="_blank"
        rel="noreferrer"
      >
        {source.title}
        <ArrowUpRight size={14} />
        <span>{source.date}</span>
      </a>
    ) : null;
  }
  function renderQuestions(items: Question[], prefix: string) {
    return (
      <Accordion multiple className="deep-questions">
        {items.map((q, i) => (
          <AccordionItem key={q.q} value={prefix + '.' + i}>
            <AccordionTrigger className="question-trigger">
              {q.q}
            </AccordionTrigger>
            <AccordionContent className="question-content">
              <p>{richText(q.a)}</p>
              {q.src && <Source id={q.src} />}{' '}
              {q.children && renderQuestions(q.children, prefix + '.' + i)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
  function nodeButton(id: string) {
    const node = data.nodes[id];
    if (!node) return null;
    return (
      <button
        className={
          'node ' +
          (id === 'NOW' ? 'present-node' : id === 'X' ? 'extinction-node' : '')
        }
        onClick={() => open(id)}
        key={id}
      >
        <span className="node-meta">
          {id === 'NOW'
            ? '2026.09'
            : id === 'X'
              ? '考えている終点'
              : id === 'H'
                ? '共通する結果'
                : id}
        </span>
        <span className="node-title">{node.title}</span>
        <span className="node-evidence">根拠：{node.evidence[0]?.kind}</span>
        <span className="node-open">
          {node.subgraph ? '解説・細かい条件' : '説明を読む'}
          <ArrowUpRight size={16} />
        </span>
      </button>
    );
  }
  function edgeButton(id: string) {
    const edge = data.edges[id];
    return (
      <div className="connector">
        <span className="connector-line" />
        {edge && (
          <button onClick={() => open(id, 'edge')}>
            <span>{edge.label}</span>
            <span className="edge-open">追加の条件を読む</span>
          </button>
        )}
        <ArrowDown size={18} />
      </div>
    );
  }
  function graphView(graph: Graph) {
    const route = data.routes.find((r) => r.id === graph.id);
    return (
      <div className="route-map">
        <div className="route-heading">
          <span className="route-number">{route?.number || '↳'}</span>
          <div>
            <h2>{graph.title}</h2>
            <p>{graph.description}</p>
          </div>
        </div>
        {graph.mode !== 'sequence' && (
          <div className="condition-rule">
            {graph.mode === 'all'
              ? '一緒に検討する条件：一つの成功だけでは、全体の成立を示しません。'
              : '別々の分岐：すべてが同時に起きる必要はありません。'}
          </div>
        )}
        {graph.mode === 'sequence' && (
          <button
            className="start-reading"
            onClick={() => open(graph.nodes[0])}
          >
            <BookOpen size={18} />
            一つずつ、詳しく読む
            <ArrowRight size={18} />
          </button>
        )}
        <div
          className={
            'route-flow ' + (graph.mode !== 'sequence' ? 'condition-flow' : '')
          }
        >
          {graph.nodes.map((id, i) => (
            <div key={id} className="route-stop">
              {nodeButton(id)}
              {graph.mode === 'sequence' &&
                i < graph.nodes.length - 1 &&
                edgeButton(graph.edges[i])}
            </div>
          ))}
        </div>
        {graph.id === 'acceleration' && (
          <>
            <div className="asi-link">
              <p>能力が幅広く伸びた先に、何を考える？</p>
              {nodeButton('ASI')}
            </div>
            <button
              className="feedback-link"
              onClick={() => open('R3-R2', 'edge')}
            >
              ↻ 改良されたAIが、次の開発をさらに進める
            </button>
          </>
        )}
        <div className="route-exits">
          <ShieldCheck size={18} />
          <span>
            各段階の「進行を止めるには」で、対策と限界を確認できます。
          </span>
        </div>
        {graph.parent && (
          <button
            className="back-parent"
            onClick={() =>
              navigate(
                Object.values(data.graphs).find((g) =>
                  g.nodes.includes(graph.parent!),
                )?.id || 'overview',
                graph.parent,
              )
            }
          >
            元の項目に戻る
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    );
  }
  const term = termId ? data.glossary[termId] : undefined;
  const node =
    selected && readMode === 'node' ? data.nodes[selected] : undefined;
  const edge =
    selected && readMode === 'edge' ? data.edges[selected] : undefined;
  const activeTab =
    data.routes.some((r) => r.id === view) ||
    ['overview', 'sources', 'history', 'news', 'glossary'].includes(view)
      ? view
      : 'detail';
  const focusedGraph = data.graphs[view];
  const focusedIndex = node ? (focusedGraph?.nodes.indexOf(node.id) ?? -1) : -1;
  function stepNavigation() {
    if (edge)
      return (
        <nav className="step-navigation" aria-label="ステップ移動">
          <button onClick={() => open(edge.from)}>前のステップ</button>
          <span>接続の条件</span>
          <button className="next-step" onClick={() => open(edge.to)}>
            次のステップ
            <ArrowRight size={17} />
          </button>
        </nav>
      );
    if (!node || !focusedGraph || focusedIndex < 0) return null;
    const prev = focusedGraph.nodes[focusedIndex - 1],
      next = focusedGraph.nodes[focusedIndex + 1];
    const nextEdge =
      focusedGraph.mode === 'sequence'
        ? focusedGraph.edges[focusedIndex]
        : undefined;
    return (
      <nav className="step-navigation" aria-label="ステップ移動">
        <button disabled={!prev} onClick={() => open(prev)}>
          前へ
        </button>
        <span>
          {focusedGraph.mode === 'sequence' ? 'ステップ' : '条件'}{' '}
          {focusedIndex + 1} / {focusedGraph.nodes.length}
        </span>
        {next ? (
          <button
            className="next-step"
            onClick={() => (nextEdge ? open(nextEdge, 'edge') : open(next))}
          >
            {nextEdge ? '次へ進む条件' : '次の条件'}
            <ArrowRight size={17} />
          </button>
        ) : (
          <button onClick={() => navigate(view)}>地図に戻る</button>
        )}
      </nav>
    );
  }
  function nodeExplanation() {
    if (!node) return null;
    return (
      <div className="explanation">
        <div className="node-terms">
          {node.terms?.map((id) => (
            <button key={id} onClick={() => setTermId(id)}>
              {data.glossary[id].name}
              <BookOpen size={14} />
            </button>
          ))}
        </div>
        <p className="plain-explanation">{richText(node.body['ひとことで'])}</p>
        {node.body['たとえば'] && (
          <div className="example">
            <span>具体例で考える</span>
            <p>{richText(node.body['たとえば'])}</p>
          </div>
        )}
        {node.subgraph && (
          <button
            className="drill-button"
            onClick={() =>
              navigate(node.subgraph!, data.graphs[node.subgraph!].nodes[0])
            }
          >
            <Waypoints size={19} />
            <div>
              <strong>この段階を、さらに分解する</strong>
              <span>
                {data.graphs[node.subgraph].nodes.length}個の条件・仕組みを見る
              </span>
            </div>
            <ArrowRight size={19} />
          </button>
        )}
        <section className="explanation-section">
          <h3>
            <ArrowRight size={18} />
            なぜ、次につながる？
          </h3>
          <p>{richText(node.body['次へ進むには'])}</p>
        </section>
        <section className="explanation-section">
          <h3>
            <BookOpen size={18} />
            今、どこまで分かっている？
          </h3>
          {node.evidence.map((e, i) => (
            <div className="evidence-item" key={i}>
              <span className="evidence-type">{e.kind}</span>
              <p>{richText(e.text)}</p>
              <Source id={e.src} />
            </div>
          ))}
        </section>
        <section className="explanation-section wall">
          <h3>残る壁と、不確実性</h3>
          <p>{richText(node.body['残る壁と不確実性'])}</p>
        </section>
        <section className="explanation-section">
          <h3>
            <ShieldCheck size={18} />
            進行を止めるには
          </h3>
          <p>{richText(node.body['進行を止めるには'])}</p>
        </section>
        {node.questions.length > 0 && (
          <section className="explanation-section">
            <h3>気になるところを、もう少し</h3>
            {renderQuestions(node.questions, node.id)}
          </section>
        )}
        <div className="related-links">
          {node.related
            .filter((l) => data.nodes[l.node])
            .map((l) => (
              <button
                key={l.text}
                onClick={() =>
                  navigate(data.graphs[l.scene] ? l.scene : view, l.node)
                }
              >
                {l.text}
                <ArrowRight size={16} />
              </button>
            ))}
        </div>
        <details className="detail-sources">
          <summary>この項目の出典</summary>
          {[
            ...new Set([...node.sources, ...node.evidence.map((e) => e.src)]),
          ].map((id) => (
            <Source key={id} id={id} />
          ))}
        </details>
      </div>
    );
  }
  function edgeExplanation() {
    if (!edge) return null;
    return (
      <div className="explanation">
        <div className="edge-endpoints">
          <span>{data.nodes[edge.from].title}</span>
          <ArrowDown size={18} />
          <span>{data.nodes[edge.to].title}</span>
        </div>
        <p className="plain-explanation">{richText(edge.explanation)}</p>
        <section className="explanation-section">
          <h3>この矢印に必要なこと</h3>
          <ul>
            {edge.conditions.map((c) => (
              <li key={c}>{richText(c)}</li>
            ))}
          </ul>
        </section>
        <section className="explanation-section wall">
          <h3>まだ言えないこと</h3>
          <p>{richText(edge.limitation)}</p>
        </section>
        <section className="explanation-section">
          <h3>
            <ShieldCheck size={18} />
            進行を止めるには
          </h3>
          <p>{richText(edge.safeguards)}</p>
        </section>
        <div className="related-links">
          <button onClick={() => open(edge.to)}>
            次の段階を読む
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="sources-list">
          {edge.sources.map((id) => (
            <Source key={id} id={id} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <main>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => navigate('overview')}
          aria-label="AI Safety Mapの全体像"
        >
          <Waypoints size={23} />
          <span>
            AI SAFETY <span className="brand-light">MAP</span>
          </span>
        </button>
        <a
          className="repository-link"
          href={REPO}
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={16} />
          <span>みんなで育てる</span>
          <ArrowUpRight size={14} />
        </a>
      </header>
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            根拠を確かめながら、未来への条件をたどる
          </span>
          <h1>現在から、人類の絶滅まで。</h1>
          <p>
            何が起きると、次へ進むのか。
            <br className="mobile-break" />
            その間に、どんな壁があるのか。
          </p>
        </div>
        <div className="as-of">
          <span className="date-dot" />
          資料確認日{' '}
          <time dateTime={data.asOf}>{data.asOf.replaceAll('-', '.')}</time>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          if (v !== 'detail') {
            const id = String(v);
            navigate(id, data.graphs[id]?.nodes[0]);
          }
        }}
        className="main-tabs"
      >
        <TabsList variant="line" className="route-tabs">
          <TabsTrigger value="overview">全体像</TabsTrigger>
          {data.routes.map((r) => (
            <TabsTrigger key={r.id} value={r.id}>
              {r.shortTitle}
            </TabsTrigger>
          ))}
          {activeTab === 'detail' && (
            <TabsTrigger value="detail">条件を深掘り</TabsTrigger>
          )}
          <TabsTrigger value="glossary">用語集</TabsTrigger>
          <TabsTrigger value="news">ニュースの読み方</TabsTrigger>
          <TabsTrigger value="history">更新履歴</TabsTrigger>
          <TabsTrigger value="sources">出典・読み方</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="map-panel">
          <div className="map-guide">
            <span>
              <span className="legend-node" />
              段階を選ぶと解説
            </span>
            <span>
              <ArrowDown size={15} />
              矢印には、追加の条件がある
            </span>
          </div>
          <p className="map-note">
            条件付きのシナリオを読むための初版です。起こる順序や結果を予告するものではなく、途中で止まる条件も一緒に考えます。
          </p>
          <div className="overview-map">
            <div className="overview-start">{nodeButton('NOW')}</div>
            <div className="fork-stem">
              <span />
              条件が重なると、異なる経路へ
              <ArrowDown size={18} />
            </div>
            <div className="overview-routes">
              {data.routes
                .filter((r) => r.id !== 'acceleration')
                .map((r) => (
                  <button
                    key={r.id}
                    className={'path-card path-' + r.id}
                    onClick={() => navigate(r.id, data.graphs[r.id].nodes[0])}
                  >
                    <span className="path-card-top">
                      <span className="route-number">{r.number}</span>
                      <span>
                        経路を開く
                        <ArrowUpRight size={16} />
                      </span>
                    </span>
                    <h2>{data.graphs[r.id].title}</h2>
                    <p>{data.graphs[r.id].description}</p>
                    <div className="path-preview">
                      {r.preview.map((t, i) => (
                        <span key={t}>
                          {i > 0 && <ArrowDown size={13} />}
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
            </div>
            {data.nodes.H && (
              <>
                <div className="fork-stem">
                  <span />
                  さらに、被害を防ぐ仕組みが破られると
                  <ArrowDown size={18} />
                </div>
                <div className="shared-outcomes">
                  {nodeButton('H')}
                  {edgeButton('H-X')}
                  {nodeButton('X')}
                </div>
                <div className="other-outcomes">
                  <span>途中には、別の結果もある</span>
                  <button onClick={() => open('E0')}>
                    <ShieldCheck size={16} />
                    生存・回復できる
                  </button>
                  <button onClick={() => open('E1')}>
                    生存するが、主導権を失う
                  </button>
                </div>
              </>
            )}
            {data.graphs.acceleration && (
              <button
                className="acceleration-entry"
                onClick={() => navigate('acceleration')}
              >
                <GitBranch size={20} />
                <div>
                  <span>進む速さを変えるもの</span>
                  <strong>AIによる研究開発・再帰的自己改善・ASI</strong>
                </div>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </TabsContent>
        {data.routes.map((r) => (
          <TabsContent key={r.id} value={r.id} className="map-panel">
            <div className="map-guide">
              <button onClick={() => navigate('overview')}>全体像に戻る</button>
              <span>段階と、その間の条件をたどる</span>
            </div>
            {graphView(data.graphs[r.id])}
          </TabsContent>
        ))}
        {activeTab === 'detail' && (
          <TabsContent value="detail" className="map-panel">
            <div className="map-guide">
              <button onClick={() => navigate('overview')}>全体像に戻る</button>
              <span>時間の順序ではなく、条件の分解</span>
            </div>
            {graphView(data.graphs[view])}
          </TabsContent>
        )}
        <TabsContent value="glossary" className="reading-panel">
          <div className="reading-heading">
            <span className="eyebrow">GLOSSARY</span>
            <h2>専門用語を、その場で確かめる。</h2>
            <p>解説の中の点線が付いた言葉は、タップすると意味が開きます。</p>
          </div>
          <label className="glossary-search">
            用語を探す
            <input
              type="search"
              value={termSearch}
              onChange={(e) => setTermSearch(e.target.value)}
              placeholder="例：ミスアライメント、ASI"
            />
          </label>
          <div className="glossary-list">
            {Object.entries(data.glossary)
              .filter(([, t]) =>
                (t.name + ' ' + t.aliases.join(' ') + ' ' + t.definition)
                  .toLowerCase()
                  .includes(termSearch.toLowerCase()),
              )
              .map(([id, t]) => (
                <button key={id} onClick={() => setTermId(id)}>
                  <span>{t.name}</span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
          </div>
          {!Object.values(data.glossary).some((t) =>
            (t.name + ' ' + t.aliases.join(' ') + ' ' + t.definition)
              .toLowerCase()
              .includes(termSearch.toLowerCase()),
          ) && (
            <p>一致する用語はありません。別の言葉でも探してみてください。</p>
          )}
        </TabsContent>
        <TabsContent value="news" className="reading-panel">
          <div className="reading-heading">
            <span className="eyebrow">READ THE NEWS</span>
            <h2>そのニュースは、どの条件の話？</h2>
            <p>一つの報告で変わる部分と、まだ分からない部分を分けます。</p>
          </div>
          <div className="news-examples">
            {data.news.map((n) => (
              <article key={n.id}>
                <h3>{n.title}</h3>
                <Source id={n.source} />
                <section>
                  <h4>地図のどこに置く？</h4>
                  <p>{richText(n.finding)}</p>
                  <div className="related-links">
                    {n.links.map((l) => (
                      <button
                        key={l.node}
                        onClick={() => navigate(l.map, l.node)}
                      >
                        <span>
                          {l.node} · {data.nodes[l.node].title}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    ))}
                  </div>
                </section>
                <section className="wall">
                  <h4>ここまでは、まだ言えない</h4>
                  <p>{richText(n.limit)}</p>
                </section>
                <section>
                  <h4>次に確かめたいこと</h4>
                  <p>{richText(n.next)}</p>
                </section>
              </article>
            ))}
          </div>
          <a
            className="text-link"
            href={REPO + '/issues/new?template=research.yml'}
            target="_blank"
            rel="noreferrer"
          >
            新しい研究・報告を提案する
            <ArrowUpRight size={16} />
          </a>
        </TabsContent>
        <TabsContent value="history" className="reading-panel">
          <div className="reading-heading">
            <span className="eyebrow">UPDATE LOG</span>
            <h2>何を、なぜ変えたか。</h2>
            <p>
              研究が増えたときも、説明を直したときも、変更の理由を残します。
            </p>
          </div>
          <ol className="history-list">
            {data.history.map((h) => (
              <li key={h.id}>
                <time>{h.date}</time>
                <div>
                  <span className="evidence-type">{h.kind}</span>
                  <h3>{h.title}</h3>
                  <p>{h.summary}</p>
                  <p className="history-difference">
                    {h.before} → {h.after}
                  </p>
                  <p>{h.reason}</p>
                  <div className="history-refs">
                    {h.nodes.map((id) => (
                      <button key={id} onClick={() => open(id)}>
                        {id}
                        <ArrowUpRight size={12} />
                      </button>
                    ))}
                  </div>
                  {h.sources.map((id) => (
                    <Source key={id} id={id} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <a
            className="text-link"
            href={REPO + '/commits/main/'}
            target="_blank"
            rel="noreferrer"
          >
            すべての変更をGitHubで見る
            <ArrowUpRight size={16} />
          </a>
        </TabsContent>
        <TabsContent value="sources" className="reading-panel">
          <div className="reading-heading">
            <span className="eyebrow">HOW TO READ</span>
            <h2>「分かっている」と「仮説」を分ける。</h2>
          </div>
          <div className="reading-copy">
            <p>
              このマップは、絶滅を予告する年表ではありません。代表的なリスクの経路を、因果関係が追える形に整理した初版です。経路どうしは重なり、これ以外の経路も考えられます。
            </p>
            <p>
              「実際の事例」「限定された実験」「将来の仮説」は、証拠の種類です。危険度の順位ではありません。ある評価でできたことと、現実の条件で繰り返しできることは分けて読みます。
            </p>
            <p>
              資料の公表日と、調査や実験が対象にした時期は別です。古い評価でできなかったことを、現在にもできないとは断定しません。
            </p>
            <p>
              「まだ起きていない」だけでは、どの防壁が効いているかは分かりません。能力の限界、対策の効果、条件がそろう機会、観測の限界を区別します。
            </p>
            <p>
              矢印は、自動的な進行を表しません。複数の条件が必要な場合、別の分岐がある場合、進む速さに関係する場合を区別します。自己改善やASIが必須ではない経路もあります。
            </p>
            <p>
              架空例と経路のつなぎ方は、このマップのための説明・整理です。出典の著者が、このマップ全体に同意していることを意味しません。根拠の追加や反論によって更新します。
            </p>
          </div>
          <h3 className="sources-title">参照した資料</h3>
          <div className="sources-list">
            {Object.keys(data.sources).map((id) => (
              <Source key={id} id={id} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <footer className="site-footer">
        <div>
          <Waypoints size={18} />
          <span>一つのニュースを、一つの根拠として。</span>
        </div>
        <nav>
          <a
            href={REPO + '/issues/new/choose'}
            target="_blank"
            rel="noreferrer"
          >
            修正を依頼
          </a>
          <a
            href={REPO + '/blob/main/CONTRIBUTING.md'}
            target="_blank"
            rel="noreferrer"
          >
            参加方法
          </a>
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight size={13} />
          </a>
        </nav>
      </footer>
      <Sheet
        open={Boolean(node || edge)}
        onOpenChange={(o) => {
          if (!o) navigate(view);
        }}
      >
        <SheetContent className="explanation-sheet" showCloseButton={false}>
          {(node || edge) && (
            <>
              <SheetHeader className="explanation-header">
                <div className="detail-topline">
                  <span>
                    {node ? '段階の解説' : 'ステップをつなぐ条件'}
                    <span className="detail-id">{selected}</span>
                  </span>
                  <SheetClose
                    className="close-detail"
                    aria-label="解説を閉じる"
                  >
                    <X size={22} />
                  </SheetClose>
                </div>
                {focusedGraph?.parent && (
                  <button
                    className="focus-parent"
                    onClick={() =>
                      navigate(
                        Object.values(data.graphs).find((g) =>
                          g.nodes.includes(focusedGraph.parent!),
                        )?.id || 'overview',
                        focusedGraph.parent,
                      )
                    }
                  >
                    ↰ 上のステップに戻る
                  </button>
                )}
                <SheetTitle className="detail-title" aria-live="polite">
                  {node?.title || edge?.label}
                </SheetTitle>
                <SheetDescription className="detail-subtitle">
                  {data.graphs[view]?.title || '現在から、未来への条件をたどる'}
                </SheetDescription>
              </SheetHeader>
              <div className="explanation-scroll" key={selected}>
                {node ? nodeExplanation() : edgeExplanation()}
                <div className="contribute-note">
                  <GitPullRequest size={18} />
                  <div>
                    <p>この説明を、よりよくする</p>
                    <a
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
                      誤り・分かりにくさを報告
                      <ArrowUpRight size={14} />
                    </a>
                    <a
                      href={REPO + '/blob/main/CONTRIBUTING.md'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      研究や修正を提案する
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
              {stepNavigation()}
              <div className="detail-bottom">
                項目の位置はアドレスに反映されています。URLで同じ箇所を示せます。
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog
        open={Boolean(term)}
        onOpenChange={(o) => {
          if (!o) setTermId(null);
        }}
      >
        <DialogContent className="glossary-dialog" showCloseButton={false}>
          {term && (
            <>
              <DialogHeader>
                <div className="detail-topline">
                  <span>専門用語の解説</span>
                  <DialogClose
                    className="close-detail"
                    aria-label="用語の解説を閉じる"
                  >
                    <X size={22} />
                  </DialogClose>
                </div>
                <DialogTitle className="glossary-title" aria-live="polite">
                  {term.name}
                </DialogTitle>
                <DialogDescription>
                  言葉の意味と、混同しやすいこと
                </DialogDescription>
              </DialogHeader>
              <div className="term-definition" key={termId}>
                <p>{richText(term.definition)}</p>
                {term.example && (
                  <div className="example">
                    <p>{richText(term.example)}</p>
                  </div>
                )}
                <div className="wall">
                  <h3>ここに注意</h3>
                  <p>{richText(term.limit)}</p>
                </div>
                <div className="sources-list">
                  {term.sources.map((id) => (
                    <Source key={id} id={id} />
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
