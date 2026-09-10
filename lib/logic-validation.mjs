// Structural checks complement, rather than replace, a scientific content review.
export function logicIssues(data) {
  const issues = [];
  const fail = (id, text) => issues.push(id + ': ' + text);
  const edges = Object.values(data.edges);
  const adjacency = new Map(Object.keys(data.nodes).map((id) => [id, []]));
  const signature = new Set();
  for (const e of edges) {
    const inputs = e.requires || [e.from];
    if (e.relation === 'joint' && (!e.requires || e.requires.length < 2))
      fail(e.id, 'AND requires at least two explicit inputs');
    const key =
      [...inputs].sort((a, b) => a.localeCompare(b)).join(',') +
      '>' +
      e.to +
      ':' +
      e.relation;
    if (signature.has(key)) fail(e.id, 'duplicate logical connection');
    signature.add(key);
    for (const input of inputs) {
      if (input === e.to) fail(e.id, 'a condition cannot require itself');
      if (!['feedback', 'mitigation'].includes(e.relation))
        adjacency.get(input)?.push(e.to);
    }
    const decomposition = data.graphs[data.nodes[e.to]?.subgraph];
    if (decomposition && e.requires) {
      if (decomposition.mode !== 'all')
        fail(e.id, 'AND arrow contradicts the output decomposition');
      if (!decomposition.nodes.every((n) => e.requires.includes(n)))
        fail(e.id, 'AND arrow omits a declared condition');
    }
    if (
      ['joint', 'conditional', 'alternative'].includes(e.relation) &&
      (!e.conditions?.length || !e.limitation || !e.basis || !e.current)
    )
      fail(
        e.id,
        'connection needs conditions, limits, basis and current evidence',
      );
  }
  const visiting = new Set(),
    done = new Set();
  function visit(id, trail) {
    if (visiting.has(id)) {
      fail(id, 'unmarked causal cycle: ' + [...trail, id].join(' -> '));
      return;
    }
    if (done.has(id)) return;
    visiting.add(id);
    for (const next of adjacency.get(id) || []) visit(next, [...trail, id]);
    visiting.delete(id);
    done.add(id);
  }
  for (const id of adjacency.keys()) visit(id, []);
  for (const g of Object.values(data.graphs)) {
    if (g.parent && ['any', 'all'].includes(g.mode)) {
      if (g.nodes.length < 2)
        fail(g.id, 'a decomposition needs at least two distinct conditions');
      for (const edge of edges) {
        if (
          g.nodes.includes(edge.from) &&
          g.nodes.includes(edge.to) &&
          ['conditional', 'joint'].includes(edge.relation)
        )
          fail(g.id, 'parallel siblings are linked as a serial prerequisite');
      }
    }
  }
  for (const [id, n] of Object.entries(data.nodes)) {
    for (const rid of n.research || []) {
      const r = data.research[rid];
      if (!r || !data.sources[r.source])
        fail(id, 'unknown primary evidence ' + rid);
      else if (!n.sources.includes(r.source))
        fail(id, 'research source absent from the node source list');
    }
    if (
      n.status === 'observed' &&
      !(n.research || []).some((rid) =>
        ['evaluation', 'observation'].includes(data.research[rid]?.type),
      )
    )
      fail(id, 'observed state has no direct observational evidence candidate');
    if (n.body && (!n.body['成立条件'] || !n.body['根拠の限界']))
      fail(id, 'realization conditions and evidence limits must be separate');
  }
  // These are editorial guardrails for the current model, not scientific theorems.
  for (const route of data.routes) {
    if (route.role && route.role !== 'factor')
      fail(route.id, 'unknown route role');
    if (
      route.role === 'factor' &&
      (!route.contexts?.length ||
        route.contexts.some(
          (id) => !data.routes.some((r) => r.id === id && r.role !== 'factor'),
        ))
    )
      fail(route.id, 'a factor needs valid scenario contexts');
  }
  if (data.routes.find((r) => r.id === 'acceleration')?.role !== 'factor')
    fail(
      'acceleration',
      'research acceleration must remain an optional factor, not a peer scenario',
    );
  const development = data.graphs['development-paths'];
  if (
    development?.mode !== 'any' ||
    development.nodes?.length !== 2 ||
    !['R5', 'R3'].every((id) => development.nodes.includes(id))
  )
    fail(
      'development-paths',
      'ordinary progress and self-improvement must remain reviewed OR alternatives',
    );
  if (data.edges['ASI-C3']?.relation !== 'influence')
    fail(
      'ASI-C3',
      'ASI adds a conditional oversight challenge, not an automatic control failure',
    );
  if (
    data.edges['R0-C2a']?.from !== 'R0' ||
    data.edges['R0-C2a']?.requires?.includes('ASI')
  )
    fail('R0-C2a', 'execution capability must retain the ASI bypass');
  const jointInputs = (id, expected) => {
    const actual = data.edges[id]?.requires;
    if (
      !actual ||
      actual.length !== expected.length ||
      !expected.every((n) => actual.includes(n))
    )
      fail(id, 'reviewed AND inputs must be ' + expected.join(', '));
  };
  jointInputs('C3-L', ['C1', 'C2', 'C3']);
  jointInputs('M3-H', ['M1', 'M2', 'M3']);
  jointInputs('W1-W4', ['W1', 'W2']);
  jointInputs('W3-W5', ['W3', 'W6']);
  jointInputs('I1a-I1', ['I1a', 'I1b']);
  jointInputs('F1-F3', ['F1', 'F2', 'F4']);
  for (const e of edges) {
    if (e.to === 'X' && e.from !== 'T')
      fail(e.id, 'extinction requires an explicit survival assessment');
    if (
      (e.from.startsWith('F') ||
        e.requires?.some((id) => id.startsWith('F'))) &&
      ['P3', 'X', 'T', 'H'].includes(e.to)
    )
      fail(
        e.id,
        'a financial crisis does not establish money obsolescence or extinction',
      );
  }
  return issues;
}
