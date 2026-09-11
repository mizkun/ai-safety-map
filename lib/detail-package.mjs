// Validate against the map shipped with the page, rather than a particular card ID.
export function readDetailPackage(payload, locale, nodeIds) {
  const data = payload?.[locale];
  if (
    !data?.nodes ||
    !nodeIds.length ||
    nodeIds.some((id) => {
      const summary = data.nodes[id]?.body?.['概要'];
      return typeof summary !== 'string' || !summary.trim();
    })
  )
    throw new Error('Invalid content package');
  return data;
}
