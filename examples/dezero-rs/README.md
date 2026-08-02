# DeZero ideas reconstructed in Rust

This crate is executable source material for the three Rust implementation
articles in this repository. It is an independent educational reconstruction,
not an official Rust port of DeZero.

The behavioral reference is the official Python source for *Deep Learning from
Scratch 3*, pinned during the article audit at commit
`b5f3cf12a9e4ed84fc97b57bf41a25610d69c9e5`:

- https://github.com/oreilly-japan/deep-learning-from-scratch-3
- https://koki0702.github.io/dezero-book/

The Rust ownership choices are intentionally small and explicit:

- produced values own their creator operation;
- operations own their input values;
- operations keep only weak references to outputs;
- gradients are values, so `backward(true)` can build a derivative graph.

Run every contract with:

```bash
cargo test --manifest-path examples/dezero-rs/Cargo.toml
```
