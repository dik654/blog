# Image retrieval learning path reconstruction

## 목표

최신 구현 목표인 제조 결함 유사 사례 검색에서 시작해, 필요한 경우에만
`Contrastive Learning`과 `Domain Fine-tuning`으로 내려가는 경로를 만든다.
세 글은 논문 계보를 오래 훑는 목록이 아니라 다음 질문에 답해야 한다.

> 높은 similarity의 과거 사진을 실제 원인·조치 근거로 써도 되는가?

정답은 similarity 하나로 결정되지 않는다. 같은 encoder 좌표계, crop과 전처리 계약,
공정 metadata, 원인 확정 상태, positive/hard-negative 정책과 새 촬영 분포를 순서대로
확인해야 한다.

## 이 경로를 먼저 고른 이유

2026-07-23 학습 흐름 감사에서 `image-rag-defect-retrieval`은 긴 본문과 수식이 있었지만
학습 질문, 내부 연결, 출처, 시각 설명과 선행지식 metadata가 부족했다. 관련 글인
`contrastive-learning`, `domain-finetuning`도 보편 규칙처럼 보이는 실험 수치와 목표
연결이 약했다.

재구성 우선순위는 다음과 같이 정했다.

1. 사용자가 실제로 만들려는 최신 시스템 질문이 분명하다.
2. Generic embedding에서 pair learning과 domain adaptation으로 내려가는 인과가 분명하다.
3. 수식, 검색 index, metadata와 UI evidence가 한 경로 안에서 만난다.
4. 잘못 설명하면 높은 similarity를 높은 원인 확률로 오해하는 운영 위험이 크다.

## 숨은 난도 검증

본문에 문제를 그대로 싣지 않고, 작성 전에 아래 문제를 내부 acceptance test로 사용했다.

> Full-image CLIP 검색에서 점수는 높지만 연마 무늬와 배경 지그가 상위에 들어온다.
> ROI와 공정 filter로 일부가 해결됐지만 새 카메라 slice에서 다시 무너진다.
> Index를 다시 만들지, hard negative를 학습할지, domain pretraining을 할지 어떤 순서로
> 판단하고 어떤 gate에서 중단해야 하는가?

완성 본문만 읽고 다음 결론에 도달할 수 있어야 통과로 보았다.

- 먼저 model/checkpoint/preprocess/crop이 같은 index partition인지 확인한다.
- Exact-search와 generic encoder를 기준선으로 남긴다.
- 배경·공정 mismatch는 ROI와 metadata 정책으로 먼저 닫는다.
- 같은 좌표계에서도 원인이 다른 false neighbor가 남으면 pair와 contrastive objective를 연다.
- 새 장비·조명 slice에서만 neighborhood가 무너지면 domain adaptation 후보를 연다.
- 평균 metric이 올라도 critical false-neighbor 또는 generic holdout이 악화되면 release하지 않는다.

## 근거 원장

주요 판단은 아래 1차 자료를 기준으로 했다.

- [CLIP](https://arxiv.org/abs/2103.00020): dual-encoder image-text representation
- [SigLIP](https://arxiv.org/abs/2303.15343): sigmoid image-text objective
- [DINOv2](https://arxiv.org/abs/2304.07193): self-supervised visual features
- [BiomedCLIP](https://arxiv.org/abs/2303.00915): biomedical image-text pretraining
- [Faiss](https://github.com/facebookresearch/faiss): vector similarity search implementation
- [MVTec AD 2](https://www.mvtec.com/research-teaching/datasets/mvtec-ad-2): lighting shift를 포함한 industrial anomaly benchmark
- [SimCLR](https://arxiv.org/abs/2002.05709): augmentation pair, projection head, NT-Xent
- [MoCo](https://arxiv.org/abs/1911.05722), [MoCo v3](https://arxiv.org/abs/2104.02057): queue 기반 계열과 queue 없는 v3 구분
- [FaceNet](https://arxiv.org/abs/1503.03832): triplet loss와 mining
- [Supervised Contrastive Learning](https://arxiv.org/abs/2004.11362): class label 기반 multi-positive objective
- [Don’t Stop Pretraining](https://arxiv.org/abs/2004.10964): domain/task adaptive pretraining 분리
- [SetFit](https://arxiv.org/abs/2209.11055): few-shot text classification의 contrastive adaptation
- [DNABERT](https://academic.oup.com/bioinformatics/article/37/15/2112/6128680), [DNABERT-2](https://arxiv.org/abs/2306.15006), [Nucleotide Transformer](https://www.biorxiv.org/content/10.1101/2023.01.11.523679v2): 다른 domain에서 tokenizer·data·objective 축을 분리하는 사례

논문 수치는 해당 architecture, data, split과 training budget의 결과로만 기록했다.
제조 검색의 예상 성능이나 보편 하이퍼파라미터로 옮기지 않았다.

## 구현 판단

### 목표 글

`image-rag-defect-retrieval`은 QuestionLead에서 시작해 다음 순서로 재구성했다.

1. Query를 “닮은 사진”이 아니라 “같은 원인과 조치의 근거”로 정의한다.
2. 같은 전처리·encoder·정규화 계약으로 query와 index 좌표를 맞춘다.
3. Top-K를 정답이 아닌 후보 집합으로 다룬다.
4. Metadata reranking과 source row로 false neighbor를 제거한다.
5. Precision@K, MRR, NDCG@K, 판정자 review와 release gate를 함께 둔다.

정규화 뒤 cosine을 다시 norm으로 나누던 중복은
`z_q^T z_i`로 통일했다. 모든 display 수식은 한국어 underbrace와 바로 이어지는
FormulaNote를 가진다.

### 필요한 기반

`contrastive-learning`은 SimCLR, triplet, SupCon을 역사 목록으로 두지 않고
현재 pair 계약에 따라 고르는 도구로 연결했다. SimCLR의 76.5%는 ResNet-50(4x) 조건,
projection head는 표준 ResNet-50 예시에서 `2048 -> 2048 -> 128`로 바로잡았다.
MoCo v1/v2의 queue를 MoCo v3의 속성처럼 설명하던 오류도 분리했다.

`domain-finetuning`은 continued pretraining과 task fine-tuning을 구분하고,
고정 learning rate·token 수·data 혼합률·label 수에 대한 보편 처방을 제거했다.
유전체 계보는 두 대표 비교로 줄이고 제조 검색에 가져올 판단 구조만 남겼다.

### 시각 설명

세 가지 상호작용 Lab을 추가했다.

- `DefectEvidenceFlowLab`: capture에서 evidence package까지 5단계
- `RetrievalPolicyLab`: full/ROI와 loose/strict metadata가 synthetic Top-3를 어떻게 바꾸는지
- `DomainAdaptationDecisionLab`: 입력 분포, pair, task 실패에 따라 다음 실험과 중단 조건을 바꾸는 판단 도구

390, 768, 1440px에서 고정 폭 SVG text를 쓰지 않고 CSS layout과 실제 DOM text를 사용했다.
모바일 5단계는 번호와 짧은 단계명만 표시하고, 키보드 Arrow/Home/End 이동과 roving tabIndex를
지원한다.

## Claude 검증 기록

Context Manager 결과는 첫 transport header가 `[claude-code:sonnet`인 경우만 채택했다.

- 첫 L4 병렬 3건: worker는 Claude였지만 모두 180초 timeout(code 143), 검증에서 제외
- 범위를 줄인 L2 병렬 4건: 모두 Claude identity 확인, 사실·수식·흐름·Viz finding 반영
- 수정 후 L2 병렬 4건: 목표 본문, contrastive, domain은 전부 PASS
- Viz 잔여 2건: 죽은 exit prop과 tab keyboard contract 수정
- 최종 L1 Viz 확인: 2/2 PASS

주요 독립 finding은 정규화/cosine 계약, pseudocode의 undefined metadata,
SimCLR 4x 수치, projection head 차원, MoCo v3 queue 설명, DNABERT 범위와 작은 글자였다.
현재 열린 confirmed finding은 0개다.

## 작은 모델용 재현 절차

4B·9B 모델에는 전체 저장소를 한 번에 주지 않는다. 아래 IR을 글 하나마다 먼저 채운다.

```json
{
  "target_question": "",
  "user_decision": "",
  "current_failure": [],
  "source_claims": [
    {"claim": "", "primary_source": "", "scope": "", "must_not_generalize": ""}
  ],
  "minimum_foundations": [],
  "stop_rule": "",
  "formula_contracts": [
    {"input": "", "operation": "", "output": "", "why_each_term": ""}
  ],
  "visual_contracts": [
    {"decision": "", "interaction": "", "state_change": "", "mobile_rule": ""}
  ],
  "release_checks": []
}
```

실행 순서는 고정한다.

1. **Extract**: 한 번에 원문 하나만 읽고 claim/source/scope를 추출한다.
2. **Route**: 최신 목표에서 필요한 foundation만 선택하고 stop rule을 쓴다.
3. **Draft**: Question → observation → mechanism → decision → failure 순서로 섹션 하나씩 작성한다.
4. **Formula**: 기호마다 입력·연산·효과를 한국어로 설명하고 FormulaNote pairing을 검사한다.
5. **Viz**: 장식이 아니라 사용자가 선택을 바꾸면 판단이 바뀌는 interaction만 만든다.
6. **Red team**: 숨은 난도 문제를 풀어 보고 본문에 없는 전제가 있으면 보강한다.
7. **Deterministic QA**: source link, internal route, overflow, console, keyboard와 formula pairing을 코드로 검사한다.
8. **Independent review**: 모델 identity를 확인한 별도 reviewer에게 좁은 파일만 맡긴다.

작은 모델이 가장 자주 실패하는 지점은 여러 논문의 수치를 섞는 것, 실험값을 보편 규칙으로
바꾸는 것, 목표와 무관한 계보를 계속 확장하는 것이다. 따라서 생성보다 먼저 scope와
`must_not_generalize`, 마지막에는 stop rule을 강제한다.

## 검증

- `npm run build`: pass, 9,346 modules
- `npm run build:tsc`: 기존 worktree의 다른 글·sidebar에 남은 20개 type error로 fail. 이번 경로 파일 error는 0
- 목표·수식·Viz Playwright: 12/12
- 전역 학습 지도·내부 연결 Playwright: 51/51
- 최종 keyboard/overflow 수식 회귀: 6/6
- 학습 흐름 감사: 세 slug 모두 score 0, blocker/review/enrichment 0
- 브라우저 폭: 390, 768, 1440px
- Claude 최종 confirmed finding: 0

## 운영 배포

- `cm-blog.service`: 2026-07-23 20:51:50 KST 재시작, active
- 운영 route: 세 slug 모두 HTTP 200
- 운영 entry: `/lab/assets/index-BGS1zSys.js`
- 운영 style: `/lab/assets/index-aam-gzyN.css`
- entry, style, module preload asset: 모두 HTTP 200
- 운영 Playwright: 12/12 pass
- 운영 검증 범위: target, contrastive, domain, CLIP 수식 회귀를 390, 768, 1440px에서 실행

이 결과는 선택 경로 하나의 release evidence다. 전체 블로그 감사의 나머지
release blocker와 enrichment backlog를 완료했다는 뜻은 아니다.
