# Defect Image Retrieval Reconstruction Spec

## Reader contract

| Item | Decision |
| --- | --- |
| Current target | A new inspection image must return past cases that are useful as operational evidence, not merely visually similar thumbnails. |
| Entry knowledge | Image, vector, metadata, and Top-K are introduced in place. No previous paper is required. |
| Minimum foundation | Same encoder/preprocess coordinate contract, cosine comparison, positive/hard-negative geometry, and domain adaptation trigger. |
| Stop rule | Do not descend below normalized vector comparison and positive/negative pair construction. ANN internals and pre-Transformer history are optional branches. |
| Exit capability | The reader can design a versioned row, choose crop/filter policy, diagnose false neighbors, and define a release gate. |

## Narrative

1. Start with one operational question: why is a visually similar case valid evidence?
2. Follow one synthetic query through capture, coordinate contract, Top-K, metadata reranking, and evidence packaging.
3. Change crop and metadata policies and observe how a high-score false neighbor moves.
4. Formalize only the operations already seen: normalization, cosine score, Top-K, ranking metrics, and fail-closed release.
5. Hand off to contrastive learning only when generic geometry fails, then to domain adaptation only when the domain shift remains.

## Visual requirements

- Stable responsive dimensions at 390, 768, and 1440 px.
- No horizontally scrolling scene or SVG text.
- Controls are segmented mode buttons with visible selected state.
- Motion explains state transitions and respects reduced-motion behavior through Framer Motion defaults.
- Every displayed number is explicitly labeled as an educational synthetic fixture.

## Source anchors

- CLIP: image-text contrastive representation and normalized similarity.
- SigLIP: pairwise sigmoid alternative.
- DINOv2: self-supervised visual representation.
- BiomedCLIP: biomedical image-text domain pretraining.
- Faiss: exact/approximate dense-vector search and normalized inner product for cosine.
- MVTec AD 2: industrial inspection evaluation under lighting distribution shift.
