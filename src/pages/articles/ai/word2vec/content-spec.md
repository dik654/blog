# Word2Vec article specification

## Reader contract

- Audience: readers who know vectors, dot products, sigmoid, and cross-entropy but have not built corpus prediction pairs.
- Entry knowledge: token IDs, embedding lookup, binary classification gradient.
- Exit capability: generate CBOW/Skip-gram examples, trace negative-sampling updates, evaluate static geometry, and identify when contextual embeddings are required.

## Narrative spine

1. Turn a sentence and window into explicit center-context training pairs.
2. Reverse the prediction direction for Skip-gram and CBOW while keeping the two-matrix score visible.
3. Replace vocabulary softmax with sampled binary pair classification and interpret `sigmoid(score)-label`.
4. Evaluate cosine neighbors and analogies without treating geometry as a complete theory of meaning.
5. Move from static word types to subword composition, contextual token states, and sentence embeddings.

## Visual rules

- The context-window explorer is the central live visualization and must support c=1,2,3 at 360px.
- The model tabs must preserve identical stage dimensions so switching does not shift the layout.
- Numeric negative-sampling rows collapse into labelled values on mobile.
- All equations use KaTeX and no formula may require horizontal scrolling.
- Avoid ungrounded 2D embedding scatterplots; dimensionality reduction must be explicitly identified when used.

## Accuracy boundaries

- Distributional similarity can include related words and antonyms, not only synonyms.
- Negative sampling is a sampled binary objective, not an exact per-step softmax probability computation.
- Input and output embeddings are distinct and extraction choice must be documented.
- Analogy offsets are empirical and evaluation-sensitive, not universal semantic laws.
- Modern LMs begin with lookup embeddings but contextual meaning is produced by subsequent sequence layers.
