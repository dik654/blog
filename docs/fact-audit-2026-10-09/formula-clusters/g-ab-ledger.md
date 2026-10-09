# g-ab 원장 — 2차 범용 템플릿 문구 재작성 (2026-10-09)

대상: `g-ab.txt`의 27개 파일. 범용 라벨(`기준량당 비율`·`허용 경계 판정`·`경계 후보 선택`·`판정 조건 결합`)과
범용 annotation 줄이 붙은 `ExplainedFormula` 30개 식을 재작성했다. 바꾼 prop은 `annotatedFormula`·`operations`뿐이다.
한 덩어리 underbrace는 의미 단위(항·분자·분모·조건)로 쪼갰고, annotation 끝에 붙어 있던 잘린 조각(`"j번째 origin cⱼ에서는 cutoff보다"` 등)도
같이 정리했다. 수치는 각 글의 `interpretation`·본문에 이미 있는 값만 다시 썼다.

## 파일별 재작성 수

| 파일 | 식 |
|---|---|
| ai/time-features/Leakage.tsx | 1 |
| ai/time-features/Overview.tsx | 1 |
| ai/time-features/Rolling.tsx | 2 |
| ai/tokenizer/BPE.tsx | 1 |
| ai/tokenizer/Overview.tsx | 1 |
| ai/transfer-learning-practice/LRStrategy.tsx | 1 |
| ai/transformer-architecture/InputEmbedding.tsx | 1 |
| ai/vllm-paged-attention/KVCacheManagerSection.tsx | 1 |
| ai/yarn-rope-extension/ExtensionAttempts.tsx | 2 |
| ai/yarn-rope-extension/YarnMethod.tsx | 1 |
| blockchain/aa-fundamentals/ERC4337.tsx | 1 |
| blockchain/aa-fundamentals/UseCases.tsx | 1 |
| blockchain/avalanche-consensus/ModernArticle.tsx | 1 |
| blockchain/berachain/ModernArticle.tsx | 1 |
| blockchain/cometbft-mempool/ModernArticle.tsx | 1 |
| blockchain/cometbft-p2p/ModernArticle.tsx | 1 |
| blockchain/cometbft-types/BlockHeader.tsx | 1 |
| blockchain/cometbft-types/VoteCommit.tsx | 1 (1차 기계 마커 `이(가) 식의 결과에`도 남아 있어 함께 제거) |
| blockchain/commonware-broadcast/ModernArticle.tsx | 1 |
| blockchain/consensus-mechanisms/ProofOfWork.tsx | 1 (라벨 2개만; annotation은 이미 도메인 문장) |
| blockchain/cosmos-sdk/ModernArticle.tsx | 1 |
| blockchain/crypto-primitives/Poseidon.tsx | 2 |
| blockchain/csprng/EntropySource.tsx | 1 |
| blockchain/csprng/Overview.tsx | 1 |
| blockchain/curve-stable/ModernArticle.tsx | 1 |
| blockchain/dai-maker/ModernArticle.tsx | 1 (1차 기계 마커 `이(가) 식의 결과에`도 함께 제거) |
| blockchain/distributed-systems/CAP.tsx | 1 |
| **합계** | **30** |

## 대표 before/after (aa-fundamentals/ERC4337.tsx)

Before
```
C_{\max}=\underbrace{(G_{verify}+G_{call}+G_{pre})\,F_{\max}}_{\text{경계 후보 선택}}
annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.", "Validation·execution·calldata 보상", ...]
```
After
```
C_{\max}=\underbrace{(G_{verify}+G_{call}+G_{pre})}_{\text{세 gas 예산의 합}}\,\underbrace{F_{\max}}_{\text{gas당 fee 상한}}
(G_{verify}+G_{call}+G_{pre}) → ["validation·execution·calldata 예산", "50,000+80,000+20,000=150,000 gas"]
F_{\max} → ["fee-per-gas 상한 20 gwei를 곱하면", "worst-case reserve 0.003 ETH", "실제 settlement는 gasUsed만큼 더 작음"]
```

## 검증

- 2차 grep(범용 문구 8종): 0건. 1차 grep(기계 마커·중첩 underbrace·`"둘 다"`): 0건.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과 (missingExplicitAnnotations 0).
- `npx eslint <27 files>`: 0 error.
- KaTeX `throwOnError:true`(사이트와 같은 `strict:"ignore"`): 27개 파일의 모든 `annotatedFormula`와 `operations.expression` 113개 렌더 성공,
  모든 expression이 해당 `formula`의 실제 부분 문자열임을 확인.
- annotation 한 줄 34자 이내 확인.

## 검토 필요

1. **crypto-primitives/Poseidon.tsx #2 — 기존 annotatedFormula가 깨져 있었음(수정함).** formula의 `\lesssim`을 마이그레이션이
   `\le` + `sssim`으로 쪼개 `b_{\mathrm{coll}}\le\underbrace{sssim \frac{…}{2}}`가 되어 있었다. 독자 화면에 "≤ sssim"이 찍혔을 것이다.
   지금은 `\lesssim`을 살리고 `c\log_2 p`·`n`·`2`에 라벨을 달았다. 같은 split 버그가 다른 cluster에도 있을 수 있다(`grep -rn 'sssim' src`).
2. **ProofOfWork.tsx** — 두 번째 라벨 `확률 가중 평균`은 목록 밖 문구지만 `1/p`(기하분포 평균 시도 수)의 뜻과 맞지 않아 `첫 성공까지 평균 시도`로 바꿨다.
3. **aa-fundamentals/ERC4337.tsx `formula`** — `C_max=(G_verify+G_call+G_pre)F_max`는 paymaster가 없는 경우만 맞다.
   EntryPoint v0.7의 prefund는 paymaster를 쓰면 `paymasterVerificationGasLimit`·`paymasterPostOpGasLimit`도 더한다. 가정(assumptions)에 "paymaster 없음"을 적을지 검토.
4. **transfer-learning-practice/LRStrategy.tsx `formula`** — `‖Δθ‖ = η‖g‖`는 plain SGD에서만 성립한다. Adam류에서는 update 방향이 gradient가 아니라
   moment로 정규화된 벡터라 `g`를 "update direction"으로 읽어야 한다. idea 문장은 그렇게 적었지만 symbol `g`가 gradient로 읽힐 수 있다.
5. **time-features/Overview.tsx `formula`** — 좌변 `ŷ_{i,c,h}`에는 horizon `h`가 있는데 우변 `f_θ(Φ(…))`에는 `h`가 없다. horizon별 model이거나
   `f_θ`가 h를 받는다는 표기가 빠졌다(오류라기보다 표기 누락).
6. 글에 수치 사례가 없는 식(time-features Leakage·Rolling, tokenizer Overview, LRStrategy, InputEmbedding, csprng Overview)은 새 숫자를 지어내지 않고
   글에 있는 구체 사례(매장 A·8월 1일·7일, `평균 10`, `i=0` 등)나 구조 설명만 썼다. 수치 대입 줄이 필요하면 본문에 사례를 먼저 추가해야 한다.
7. tsc 결과는 아래 "tsc" 절 참고(오류 없음, 기본 heap에서는 OOM).

## tsc

`npx tsc -b --noEmit`를 기본 heap으로 돌리면 4GB에서 OOM(exit 134)이 난다. `NODE_OPTIONS=--max-old-space-size=12288`로 다시 돌린 결과는 exit 0, 출력 0줄이다(오류 없음).
