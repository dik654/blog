export function mergeResearchQueue({ previousCandidates, discovered, successfulSourceIds, refreshedAt }) {
  const refreshedIds = new Set(discovered.map((item) => item.id));
  const byId = new Map(previousCandidates.map((item) => [item.id, item]));

  for (const item of discovered) {
    const previous = byId.get(item.id);
    byId.set(item.id, previous ? {
      ...item,
      discoveredAt: previous.discoveredAt,
      lastSeenAt: refreshedAt,
      status: previous.status === 'not-refreshed' ? 'discovered' : previous.status,
      editorial: previous.editorial,
      promotionReview: previous.promotionReview ?? item.promotionReview,
    } : { ...item, lastSeenAt: refreshedAt });
  }

  for (const [id, item] of byId) {
    if (successfulSourceIds.has(item.sourceId) && item.status === 'discovered' && !refreshedIds.has(id)) {
      byId.set(id, { ...item, status: 'not-refreshed', lastCheckedAt: refreshedAt });
    }
  }

  return [...byId.values()];
}
