# Evidence and provenance protocol

## Why this exists

The public article is a rendered explanation. It is not the source of truth for why a claim, equation or Viz was included. Every deep article keeps a private evidence ledger so later revisions can recover the original source, author intent and scope decision.

## Required evidence record

Every substantial section records:

1. **Source locator**: URL plus page, section, figure, equation, timestamp, file or symbol.
2. **Original claim**: what the source actually supports.
3. **Interpretation boundary**: what can and cannot be inferred from it.
4. **Inclusion intent**: which gap in the learning chain this evidence closes.
5. **Reader outcome**: the calculation, implementation or diagnosis enabled by the section.
6. **Public transformation**: how the evidence becomes Korean prose, a worked equation, an interactive Viz or a comparison.
7. **Scope decision**: deep, brief or defer, including the reason for omission.

Records follow `evidence-record.schema.json`. The source language is preserved. Translation happens only in the public renderer.

## Source-to-article compiler

`source block -> claim -> mechanism -> shape/equation -> evidence -> failure -> implementation consequence -> reader outcome`

- A claim without a mechanism becomes an unsupported summary.
- An equation without symbol meaning and operation choice becomes notation copying.
- A figure without an execution order becomes decoration.
- A result table without task, baseline, metric and caveat becomes marketing.
- A code excerpt without lifecycle and failure boundary becomes syntax narration.

## Viz transformation rules

- Preserve the invariant or data flow, not the source's visual styling.
- Use a small inspectable example whose values can be recomputed by the reader.
- State which source figure/equation motivated the Viz in the private ledger.
- Record every deliberate simplification and the case where it stops matching the full method.
- Do not imply causality from a paper result when the experiment only reports correlation or benchmark improvement.

## Revision gate

Before publishing, another pass must be able to answer:

- Why is this section here?
- Which source supports its main claim?
- What did the article deliberately simplify or omit?
- Can a reader solve the private mastery problems using only the public article?
- Does the Viz prove the intended mechanism at mobile and desktop widths?

If any answer exists only in the author's memory, the ledger or article is incomplete.
