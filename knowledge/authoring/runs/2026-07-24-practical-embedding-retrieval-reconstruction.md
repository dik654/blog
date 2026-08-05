# Practical embedding retrieval reconstruction

Date: 2026-07-24 KST

## Scope

기존의 모델·기법 소개형 글 네 개를 두 개의 실제 검색 경로로 재구성했다.

```text
이미지 검색
결함 사진 검색 계약
→ pair geometry가 실패할 때 Contrastive Learning
→ domain shift가 확인될 때 공통 Domain Adaptation

텍스트 검색
Query·document 검색 계약
→ domain shift가 확인될 때 공통 Domain Adaptation
```

기존 slug는 유지했다.

- `image-rag-defect-retrieval`
- `contrastive-learning`
- `domain-finetuning`
- `sentence-embeddings`

설계 원장은
`src/pages/articles/ai/content-specs/practical-embedding-retrieval.md`다.

## Why this structure

기존 구조는 image RAG, contrastive learning, domain fine-tuning과 sentence embedding을
각각 설명했지만 다음 연결이 약했다.

- 무엇을 relevant라고 부르는지가 model보다 먼저라는 점
- Exact retrieval과 ANN index quality를 분리하는 기준선
- Pair·augmentation·hard negative가 검색 geometry를 어떻게 정의하는지
- Acquisition, vocabulary와 relevance shift에 따라 adaptation 개입이 달라지는 이유
- Encoder·tokenizer·instruction·pooling 변경이 왜 full reindex를 요구하는지
- Public leaderboard와 production corpus release가 다른 평가라는 점

따라서 model gallery가 아니라
`query → corpus → relevance → split → exact baseline → ANN/filter/rerank → error slice
→ minimum adaptation → shadow reindex → release`를 공통 editorial loop로 삼았다.

## Hard transfer questions

본문을 쓰기 전에 열 개의 비공개 문제를 만들었다. 문제를 article에 그대로 싣지 않고,
본문만 읽은 독자가 새로운 상황에도 같은 판단 축을 적용할 수 있는지 검사했다.

1. 같은 부품의 다른 각도만 찾고 다른 부품의 같은 root cause는 못 찾을 때 model과 relevance
   label 중 무엇을 먼저 의심하는가?
2. 같은 lot 촬영을 random file split으로 나누면 왜 품질이 과대평가되는가?
3. Embedding이 같은데 새 HNSW index의 recall이 3% 떨어졌다면 어느 층을 조사하는가?
4. 같은 augmentation이 한 task에는 invariance를 만들고 다른 task에는 label signal을 지우는
   이유는 무엇인가?
5. 같은 원인의 sample이 InfoNCE denominator에서 negative가 되면 어떤 반발 gradient가
   생기는가?
6. Label noise가 있을 때 hardest negative만 쓰면 왜 불안정해지는가?
7. Target retrieval은 오르고 general query가 무너지면 어떤 anchor evaluation이 빠졌는가?
8. Tokenizer, prefix, pooling 또는 checkpoint 변경이 왜 full reindex boundary인가?
9. Instruction-aware embedding model의 query instruction을 빼면 public score가 왜
   production으로 전이되지 않을 수 있는가?
10. Bi-encoder recall은 높지만 상위 순서가 나쁘다면 왜 reranking이 별도 개입인가?

Claude curriculum audit에서 4번 문제가 본문의 color-jitter/discoloration 예시와 너무 같다는
finding을 받아, 본문은 blur/texture의 일반 원리를 가르치고 private test는 다른 변환·신호에
전이하도록 분리했다. 5번은 false negative가 denominator `Z_i`에 들어가 logit을 낮추는 반발
gradient를 수식 의미에 명시했다.

## Content decisions

### Image retrieval

- “같음”을 외관, defect type, root cause와 corrective action으로 분리했다.
- File보다 product·lot·equipment·site·time lineage를 우선하는 split contract를 세웠다.
- Encoder뿐 아니라 checkpoint, resize, ROI, crop, pooling, dimension과 normalization을
  coordinate manifest로 묶었다.
- Exact search를 embedding 기준선으로 사용하고 ANN recall을 별도 metric으로 분리했다.
- Filter는 운영 조건을, reranker는 이미 회수된 후보의 순서를 책임지게 했다.
- Index artifact digest, distance, build seed와 search parameter를 silent recall regression의
  첫 debugging evidence로 연결했다.
- Shadow index, dual read, atomic alias swap과 rollback을 release 절차로 닫았다.

### Contrastive pair geometry

- Positive·negative를 class name이 아니라 downstream relevance와 entity lineage로 정의했다.
- Augmentation을 “지워도 되는 정보”에 대한 invariance claim으로 설명했다.
- SimCLR InfoNCE, FaceNet triplet mining과 SupCon을 시대 순 recipe가 아닌 서로 다른
  objective 후보로 분리했다.
- FaceNet 원문의 L2-normalized squared Euclidean boundary와 SupCon `L_out` 식을 명시했다.
- Batch·queue가 negative 수뿐 아니라 false negative gradient도 늘릴 수 있음을 보였다.
- Loss curve가 아니라 고정 corpus retrieval, slice와 full reindex로 학습 효과를 판정한다.

### Domain adaptation

- Acquisition, vocabulary와 relevance-definition shift를 한 “domain shift”로 뭉치지 않았다.
- Frozen baseline과 preprocessing repair를 가장 낮은 비용의 첫 후보로 둔다.
- Unlabeled domain corpus에는 continued pretraining, labeled pair에는 supervised metric
  adaptation을 대응시켰다.
- Target gain과 original-domain anchor regression을 함께 계산한다.
- Encoder·tokenizer·pooling·dimension 변경을 coordinate migration으로 취급하고 새 index를
  shadow 구축한다.
- DAPT/TAPT, BioBERT와 WILDS의 근거를 text domain·distribution-shift 연구 범위 밖의
  보편 recipe로 확장하지 않았다.

### Text retrieval

- Semantic similarity, answer relevance, duplicate detection과 clustering의 가까움을 분리했다.
- Masked mean, CLS와 last-token pooling을 model-specific contract로 다뤘다.
- Bi-encoder candidate recall과 cross-encoder reranking의 책임과 비용을 나눴다.
- SBERT → E5/multilingual E5 → BGE-M3 → Qwen3 Embedding을 영구 순위가 아닌 계보와
  현재 후보로 설명했다.
- Query/document instruction, tokenizer, max length, dimension, normalization, license와
  runtime을 candidate manifest에 고정했다.
- MTEB/MMTEB는 orientation으로 사용하고 한국어·다국어·code·long document·no-answer와
  hard-negative production slice에서 최종 release를 결정한다.

## Formula and Viz contract

모든 display 수식은 `String.raw`와 공용 `FormulaPair`를 사용한다. 한 줄에 긴 식을 축소하지
않고 semantic intermediate를 세 줄로 분리했다. 각 underbrace와 바로 아래 meaning·symbol
ledger는 한국어로 썼다.

390px 최종 auto-fit scale:

- Image retrieval: `1.00`, `1.00`
- Contrastive learning: `1.00`, `0.96`, `0.88`
- Domain adaptation: `1.00`
- Text retrieval: `0.86`, `1.00`

모두 기준 `>= 0.80`을 통과했다.

새 interactive Viz:

- `RelevanceContractLab`: 검색 목표와 lineage split에 따라 positive·hard negative·누수가
  달라진다.
- `RetrievalStackLab`: 오검색, ANN 누락, metadata mismatch와 ordering failure를 서로 다른
  층으로 보낸다.
- `PairMiningLab`: batch composition이 만든 false negative를 드러낸다.
- `DomainShiftGateLab`: shift 종류와 label access에 따라 최소 adaptation 후보가 바뀐다.
- `PoolingMaskLab`: padding을 평균에 포함할 때 짧은 문장 signal이 희석되는 과정을 보여 준다.
- `TextRetrievalContractLab`: instruction과 reranker가 input/release contract를 어떻게
  바꾸는지 보여 준다.

390px lab 다섯 개, desktop pooling lab과 가장 긴 formula 세 개를 screenshot으로 직접
확인했다. 겹침, 우측 잘림, 내부 horizontal scroll과 부자연스러운 빈 공간은 없었다.
Dynamic verdict에는 `role="status"`와 `aria-live="polite"`를 추가했다.

## Shared path persistence

`domain-finetuning`은 이미지와 텍스트가 공유하는 선택 글이다. 목록에서 두 번 복제하지 않고,
텍스트 경로로 이동할 때 `?path=ai-practical-text-embedding`을 URL에 남긴다.

- React Router state는 즉시 이동 문맥을 보존한다.
- URL query는 refresh, bookmark와 shared URL에서도 같은 path를 복구한다.
- 상단 rail, compact previous/next, continuity panel과 하단 previous/next가 query와 state를
  함께 전달한다.
- Playwright는 client navigation 뒤 current step과 reload 뒤 복구를 모두 검사한다.

## Primary-source boundary

Article이 인용한 18개 source URL을 확인했다.

- CLIP, SigLIP, DINOv2와 HNSW: representation·similarity와 ANN의 원 논문 경계
- SimCLR, FaceNet과 SupCon: pair objective와 mining의 원 논문 경계
- DAPT/TAPT, BioBERT와 WILDS: domain continuation과 distribution shift의 범위
- Sentence-BERT, E5, multilingual E5, BGE-M3와 Qwen3 Embedding: text representation 계보
- MTEB documentation과 MMTEB: evolving benchmark collection의 현재 경계

Oxford Academic BioBERT URL은 자동 fetch를 403으로 막아 같은 논문의 PubMed Central full
text URL로 바꿨다. 논문 수치, model rank, prefix, dimension, corpus scale와 latency는 해당
publication·model card 밖의 보편 recommendation으로 확장하지 않는다.

## Context Manager and Claude evidence

첫 transport metadata header가 `[claude-code:sonnet`으로 시작하는 결과만 true-Claude
검토로 채택했다.

### Failed attempts

- Broad article audits 네 건은 5분 이상 응답이 없어 실행을 종료했다.
- 더 작은 prose-only 감사 네 건도 180초 timeout이 났다.
- 둘 다 성공 헤더가 없어 Claude validation으로 계산하지 않았다.

### Successful parallel audits

- Image retrieval + contrastive factual audit:
  `[claude-code:sonnet · L3 · $0.0000 · 79965ms]`, PASS
- Domain + text factual audit:
  `[claude-code:sonnet · L3 · $0.0000 · 95418ms]`, PASS
- Curriculum/private-transfer audit:
  `[claude-code:sonnet · L3 · $0.0000 · 134608ms]`, PASS with two gaps
- UI/Viz/math/path audit:
  `[claude-code:sonnet · L3 · $0.0000 · 132282ms]`, findings

반영한 finding:

- Private Q4의 exact worked example을 일반 원리 예시로 교체했다.
- False negative와 InfoNCE denominator gradient를 연결했다.
- Unchanged-embedding ANN regression과 index manifest를 연결했다.
- FaceNet metric과 SupCon `L_out` source boundary를 명시했다.
- Shared article path를 URL query로 영속화했다.
- 모든 declared-path navigation link가 state와 query를 전달하게 했다.
- Dynamic verdict에 live-region semantics를 추가하고 좁은 table text에 wrap을 보강했다.
- 긴 수식을 의미 단위로 다시 써 390px 최소 scale을 `0.88`로 높였다.

### Post-fix audits

- Curriculum/factual finding recheck:
  `[claude-code:sonnet · L2 · $0.0000 · 70510ms]`, PASS
- Path/UI/Viz/math finding recheck:
  `[claude-code:sonnet · L2 · $0.0000 · 48379ms]`, PASS

## Verification before deployment

- `npx tsc --noEmit`: pass
- Targeted ESLint: pass
- `git diff --check`: pass
- `tests/practical-embedding-retrieval.spec.ts`: 13/13 pass
- Embedding authored-path/sidebar regression: 1/1 pass
- 390px formula auto-fit scale: all `>= 0.80`
- Six interactive labs: state-transition assertions pass
- Shared text path: client navigation and reload persistence pass
- 18 source URLs: 17 initial HTTP 200; BioBERT changed from bot-blocked OUP to PMC
- Repository-local screenshot review: pass
- Claude factual, curriculum and UI/Viz/math re-audit: pass

## Production evidence

- `npm run build`: pass, Vite production build completed in 18.36s
- `systemctl --user restart cm-blog.service`: pass
- Service state: active/running from 2026-07-24 19:34:48 KST
- Four article routes and `?sub=ai-practical-embedding`: HTTP 200
- Production `tests/practical-embedding-retrieval.spec.ts`: 13/13 pass
- Production authored-path/sidebar regression: 1/1 pass

이 배치는 source research, private transfer audit, reconstruction rationale, true-Claude
factual·curriculum·UI audit, responsive Viz·formula assertions와 production deployment까지
닫혔다.
