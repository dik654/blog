# r-ad 수식 주석 재작성 원장 (2026-10-09)

범위: `r-ad.txt`의 38개 파일. 고친 prop은 `annotatedFormula`, `operations`뿐이다. `formula`, `question`, `idea`, `terms`, `interpretation`, `assumptions`, 본문 prose는 바꾸지 않았다.

- 재작성한 식: **87개**
  - 브리프의 기계 문구 마커가 있던 식 78개
  - 브리프의 "범용 문구만 있는 것"에 해당하는 AND-gate 식 9개. 라벨은 `판정 조건 결합`, 주석은 `필요한 gate가 모두 참일 때만…`이었다. 위치는 fvm#3, ipc#1·#3, onchain-cloud#3, pdp#3, giwa#3, ipfs#3, lotus-chain#0, lotus-mpool#3
- 남은 마커: 0건. 브리프 grep 기준이며, `기준량당 비율|허용 경계 판정|판정 조건 결합|결과에 기여|\text{… 계산}`도 0건이다.
- 중첩 underbrace는 모두 한 겹으로 폈다. 해당 식은 hotstuff2·jolteon·narwhal·tusk·pbft·initia·smr·omni-octane 등이다.
- 원칙: 라벨에는 이 시스템에서의 뜻을 단다. operation 주석은 1~3줄, 한 줄 34자 이내로 쓰고, 각 글의 `interpretation`·`idea`에 이미 있는 수치를 대입했다. 새 수치는 그 수치에서 산술로만 유도했다. 예: 0.5^10≈0.098%, 30×120=60², 42&7=2.

## 파일별 재작성 수

| 식 수 | 파일 |
|---:|---|
| 1 | `src/pages/articles/blockchain/erasure-coding/ReedSolomon.tsx` |
| 1 | `src/pages/articles/blockchain/erasure-coding/TwoDimensional.tsx` |
| 1 | `src/pages/articles/blockchain/extension-fields/Fp12.tsx` |
| 1 | `src/pages/articles/blockchain/extension-fields/Fp6.tsx` |
| 1 | `src/pages/articles/blockchain/fft/DFT.tsx` |
| 2 | `src/pages/articles/blockchain/filecoin-f3/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/filecoin-fvm/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/filecoin-gpu-proofs/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/filecoin-ipc/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/filecoin-onchain-cloud/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/filecoin-pdp/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/finite-field-theory/ExtensionField.tsx` |
| 4 | `src/pages/articles/blockchain/giwa-chain/ModernArticle.tsx` |
| 2 | `src/pages/articles/blockchain/halo2/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/hotstuff2/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/impl-elliptic-curve/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/impl-groth16/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/impl-hash-commitment/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/initia-evm/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/ipfs-filecoin-storage/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/jolteon-ditto/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/kohaku-provider/ModernArticle.tsx` |
| 2 | `src/pages/articles/blockchain/lotus-chain/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/lotus-mpool/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/lotus-state/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/msm-ntt/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/narwhal-deep/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/omni-octane/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/pbft-deep/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/plonky3/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/proofofsql/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/proofs-post/ModernArticle.tsx` |
| 3 | `src/pages/articles/blockchain/proofs-snark/ModernArticle.tsx` |
| 4 | `src/pages/articles/blockchain/risc0/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/smr-theory/Overview.tsx` |
| 1 | `src/pages/articles/blockchain/tendermint-bft/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/tusk/ModernArticle.tsx` |
| 1 | `src/pages/articles/blockchain/uniswap-v3/Overview.tsx` |

## 대표 before / after

`src/pages/articles/blockchain/hotstuff2/ModernArticle.tsx`

Before:
```tex
|Q_i|&\ge \underbrace{\underbrace{2\underbrace{f+1}_{\text{honest-intersection 계산}}}_{\text{honest-intersection 계산}}}_{\text{honest-intersection 계산}}
```
operations: 같은 `"honest-intersection floor이(가) 식의 결과에 기여하는 방식을 계산합니다."`를 3회 반복(`2f+1` 두 번 포함).

After:
```tex
\underbrace{|Q_i|}_{\text{inner vote 수}}&\ge 2f+1\\
\underbrace{|Q_o|}_{\text{outer vote 수}}&\ge 2f+1\\
\underbrace{|Q_1\cap Q_2|}_{\text{두 quorum 교집합}}&\ge \underbrace{f+1}_{\text{honest 1명 이상}}
```
operations:
- `2f+1`: "inner·outer 모두 서로 다른 2f+1명" / "n=4, f=1이면 각각 3표"
- `|Q_1\cap Q_2|`: "3f+1 안에서 2f+1 집합 둘을 고르면" / "최소 2(2f+1)−(3f+1)=f+1명 겹침"
- `f+1`: "겹친 f+1 중 Byzantine은 최대 f명" / "n=4면 2명 겹치고 honest 1명 남음"

## 검증

- 마커 grep(브리프 7항목): 0건
- KaTeX: 38개 파일의 `formula`·`annotatedFormula`·`operations.expression`을 `katex.renderToString(throwOnError)`로 전수 렌더해 오류 0건
- 모든 `operations[].expression`이 해당 `formula`에 그대로 있는 조각인지 스크립트로 확인함(불일치 0건)
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과(explainedFormulas 1475, missingExplicitAnnotations 0)
- `npx eslint <38 files>`: 0 error
- `npx tsc -b --noEmit`: exit 0. 기본 heap에서는 OOM이 나서 `NODE_OPTIONS=--max-old-space-size=12288`로 다시 실행했다. 내 파일과 다른 파일 모두 타입 오류가 없었다.

## 검토 필요

1. `impl-hash-commitment/ModernArticle.tsx` #1: `formula`의 원소 개수와 차원이 맞지 않는 것으로 보인다. `E(b)=(tag, |b|, LE_w(b_0),…,LE_w(b_k)) ∈ F_p^{k+2}`에서 튜플은 tag 1 + 길이 1 + chunk k+1 = k+3개다. 브리프 규칙상 `formula`는 그대로 두었고 주석만 다시 썼다. 저자 확인이 필요하다(`b_0..b_{k-1}`로 고치거나 `F_p^{k+3}`로 고치는 안).
2. `uniswap-v3/Overview.tsx`: 라벨 "token0 virtual"·"token1 virtual"과 대입식 10+20=30, 60+60=120은 interpretation의 √pₐ=1, √pᵦ=3, L=60, x=10, y=60에서 계산한 값이다. 글이 이 중간값을 직접 쓰지는 않는다.
3. `hotstuff2`·`narwhal-deep`: 교집합 하한 유도식 `2(2f+1)−(3f+1)=f+1`은 글의 `idea`에 있는 "2q−n"을 대입한 것이다. narwhal 글에는 `2q−n`이 명시돼 있고 hotstuff2 글에는 결과 f+1만 있다.
4. `lotus-state` #0: "256/5=51.2 level", "남은 1 bit"는 수식 수치에서 유도한 값이다(5×51=255).
