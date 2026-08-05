import assert from 'node:assert/strict';
import { mergeResearchQueue } from './research-queue-state.mjs';

const refreshedAt = '2026-07-21T12:00:00.000Z';
const promotionReview = { decision: 'pending', mechanismChanged: null };
const previousCandidates = [
  { id: 'old-active', sourceId: 'ok-source', status: 'discovered', discoveredAt: '2026-06-01T00:00:00.000Z' },
  { id: 'failed-source-item', sourceId: 'failed-source', status: 'discovered', discoveredAt: '2026-06-02T00:00:00.000Z' },
  { id: 'reviewed', sourceId: 'ok-source', status: 'reviewed', editorial: { reviewer: 'editor-a' }, discoveredAt: '2026-06-03T00:00:00.000Z' },
  { id: 'returns', sourceId: 'ok-source', status: 'not-refreshed', discoveredAt: '2026-06-04T00:00:00.000Z', promotionReview },
];
const discovered = [
  { id: 'returns', sourceId: 'ok-source', status: 'discovered', discoveredAt: refreshedAt, promotionReview: { decision: 'new-default' } },
  { id: 'brand-new', sourceId: 'ok-source', status: 'discovered', discoveredAt: refreshedAt },
];

const merged = mergeResearchQueue({
  previousCandidates,
  discovered,
  successfulSourceIds: new Set(['ok-source']),
  refreshedAt,
});
const byId = new Map(merged.map((item) => [item.id, item]));

assert.equal(merged.length, 5, '병합은 기존 후보를 삭제하지 않는다');
assert.equal(byId.get('old-active').status, 'not-refreshed');
assert.equal(byId.get('old-active').lastCheckedAt, refreshedAt);
assert.equal(byId.get('failed-source-item').status, 'discovered', '실패한 source 상태는 바꾸지 않는다');
assert.equal(byId.get('reviewed').status, 'reviewed', '편집 상태는 보존한다');
assert.deepEqual(byId.get('reviewed').editorial, { reviewer: 'editor-a' });
assert.equal(byId.get('returns').status, 'discovered', '다시 발견되면 active queue로 돌아온다');
assert.equal(byId.get('returns').discoveredAt, '2026-06-04T00:00:00.000Z', '최초 발견 시각은 보존한다');
assert.equal(byId.get('returns').lastSeenAt, refreshedAt);
assert.deepEqual(byId.get('returns').promotionReview, promotionReview, '기존 review 입력은 feed refresh로 덮어쓰지 않는다');
assert.equal(byId.get('brand-new').lastSeenAt, refreshedAt);

process.stdout.write('research queue state: 10 assertions passed\n');
