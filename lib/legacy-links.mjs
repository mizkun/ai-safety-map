// Preserve previously shared URLs while removing misleading legacy arrows from the graph.
export const legacyEdgeLinks = {
  'C1-C2': 'C3-L', 'C2-C3': 'C3-L', 'C3-C4': 'L-C4',
  'M1-M2': 'M3-H', 'M2-M3': 'M3-H', 'W4-W5': 'W3-W5', 'H-X': 'H-T',
};

export function currentEdgeId(id) { return legacyEdgeLinks[id] || id; }
