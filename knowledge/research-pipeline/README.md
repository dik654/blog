# Research discovery and curriculum growth

## Purpose

The pipeline watches original research sources and company research publications, then proposes where new evidence belongs in the blog's prerequisite graph. It never publishes directly from a feed.

## Stages

1. **Discover**: read official Atom feeds and sitemaps from `sources.json`.
2. **Normalize**: keep canonical URL, source organization, date and title-like identifier.
3. **Deduplicate**: canonical URL is the first key; paper DOI/arXiv ID and title similarity are later ingestion keys.
4. **Route**: score candidates against `topics.json` and propose a category.
5. **Compare the current top**: compare the candidate with the one declared current source for the target track.
6. **Compile evidence**: create records following `../authoring/evidence-record.schema.json`.
7. **Review the foundation delta**: reuse the current concepts by default. Add a prerequisite only when a new mechanism cannot be calculated, implemented or diagnosed with the existing floor.
8. **Author and audit**: use the paper protocol, private mastery problems and responsive Viz checks.
9. **Review and publish**: build, visual regression and source-intent review are mandatory gates.

## Commands

```bash
npm run research:discover:dry
npm run research:discover -- --since-days=45
npm run research:discover -- --source=anthropic-research
```

The non-dry command updates `queue.json`. Discovery is deterministic and does not require an LLM. Full PDF/HTML/video ingestion and article generation are deliberately separate because they require evidence validation and editorial review.

Each source is isolated. A temporary feed or sitemap failure is recorded in `queue.json.lastRun.failures`; candidates from that failed source remain intact while successful sources refresh. A previously discovered candidate that falls outside the current time window or per-source limit is preserved as `not-refreshed` instead of being deleted; when it is observed again, it returns to `discovered`. The command fails only when every selected source fails.

## Scheduled discovery

The repository includes `ops/systemd/blog-research-discovery.service` and `.timer`. The user timer runs once per day at 07:30 Asia/Seoul with a randomized delay and catches missed runs through `Persistent=true`.

```bash
mkdir -p ~/.config/systemd/user
cp ops/systemd/blog-research-discovery.{service,timer} ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now blog-research-discovery.timer
systemctl --user list-timers blog-research-discovery.timer
```

## Current-first placement policy

- Every track has one replaceable current target, a small stable concept/science floor, one representative minimum primary source and an implementation/verification edge in `src/content/ai/topdownResearchTracks.ts`.
- A new source first competes with the current source. Publication date alone does not promote it.
- A source that improves only benchmark numbers or scale updates the comparison record; it does not grow the curriculum.
- A source that changes a reusable compute, data, objective, runtime or verification contract may replace the current top.
- A promoted source may add a foundation delta only when the existing floor cannot explain and reproduce the changed contract.
- The previous current source moves to hidden evidence history. It does not become another mandatory paper.
- A source with weak evidence, unclear provenance or duplicate claims remains on the watchlist.

This keeps the graph stable: new work usually changes one current pointer, occasionally adds one reusable foundation delta, and never starts an unbounded historical chain.

Each queue candidate carries a `promotionReview` object. Editorial review must fill `mechanismChanged`, `existingFoundationsSufficient`, `foundationDelta` and `decision` before authoring begins. Discovery never makes this decision automatically.
