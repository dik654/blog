# AI 서빙 묶음 03 · 실행 묶음과 KV 공간

작성일: 2026-10-24
범위: `ai/continuous-batching-step-anatomy`, `ai/prefill-decode-phase-dynamics`, `ai/vllm-paged-attention`, `ai/serving-memory-admission-and-preemption`, `ai/prefix-caching-radix-attention`

## 묶음의 직속 부모

앞 묶음은 요청을 관측하고 이번 실행의 배정량을 만드는 데까지 왔습니다. 이 묶음은 그 배정을 실제 반복 실행과 KV 공간의 상태 전이로 확대합니다.

1. 묶음: 실행 경계에서 완료·진행·신규 요청을 다시 구성합니다.
2. 단계: prefill과 decode가 같은 실행 자원을 두고 만나는 비용을 셉니다.
3. 기록: 논리 위치를 고정 크기 KV block에 연결합니다.
4. 수용: block 부족 때 대기·선점·재계산·교환의 경계를 확인합니다.
5. 재사용: 같은 prefix가 가리키는 block을 찾고 보호하고 반환합니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| Continuous batching step | concept | 실행 한 번이 끝날 때 다음 요청 묶음은 어떤 세 한도를 함께 통과해야 하는가? |
| Prefill·decode dynamics | concept | 같은 token 수라도 입력 읽기와 출력 이어 쓰기의 연산·전송 비용은 왜 다른가? |
| PagedAttention | concept | 가변 길이 KV 상태를 block 표와 참조 수로 어떻게 배정하고 해제하는가? |
| Memory admission·preemption | concept | 공간이 부족할 때 신규 수용과 실행 중 성장, 중단 뒤 복원은 어떻게 다른가? |
| Prefix caching | concept | 같은 앞부분을 찾아 공유한 KV의 수명과 공정성을 어떻게 보존하는가? |

vLLM·SGLang은 메커니즘을 확인하는 고정 원문입니다. 어떤 엔진을 운영 환경에 채택할지는 별도의 실무 비교와 동일 조건 측정에서 결정합니다.

## 보존한 근거

- Continuous batching의 A·B·C·D token 장부와 실제 scheduler 배정·rollback 경계를 유지했습니다.
- Prefill·decode의 연산량·KV 읽기·chunk 후보·분리 서빙 경계와 고정 원문·논문 근거를 유지했습니다.
- PagedAttention의 block table, hash, 참조 수, copy-on-write와 kernel 읽기 경로를 유지했습니다.
- Memory admission의 watermark, allocate 실패, recompute·swap, 긴 문맥 격리와 우선순위 경계를 유지했습니다.
- Prefix caching의 radix split, page 단위 hit, 보호·eviction, cascade·공정성·가격 계산을 유지했습니다.
- 측정하지 않은 처리량·지연·cache 효과를 결과처럼 쓰지 않았습니다.

## 이번 변경

- 다섯 글을 앞 묶음과 같은 `ServingEngineSeriesLocator`에 연결했습니다.
- 각 글의 현재 결정과 확인할 결론을 본문보다 먼저 표시했습니다.
- 글 끝에서 확인한 사실을 같은 지도에 되돌리고 다음 결정으로 이동합니다.
- 다섯 경로를 JavaScript 비활성 정적 본문 생성 목록에 등록했습니다.

## 검증 상태

- [x] 대상 파일 ESLint
- [x] TypeScript
- [x] 전체 build와 strict audit
- [x] 390×844 가로 넘침과 지도 밀도
- [x] 1440×900 가로 넘침
- [x] 키보드와 중간 장면
- [x] reduced-motion
- [x] JavaScript 비활성 정적 본문과 부모 지도
- [ ] 공개 경로
