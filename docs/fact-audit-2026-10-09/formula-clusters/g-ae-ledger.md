# g-ae 수식 주석 2차(범용 템플릿 문구) 재작성 원장

- 범위: `g-ae.txt` 36개 파일, 범용 문구가 붙어 있던 `ExplainedFormula` 43개 (JSX prop 32개, config object 11개)
- 바꾼 prop: `annotatedFormula`, `operations`만. `formula`·`question`·`idea`·`terms`·`interpretation`·본문은 그대로 둠
- 방식: 식 전체를 한 덩어리로 묶은 underbrace(`기준량당 비율`·`경계 후보 선택`·`판정 조건 결합`·`허용 경계 판정`)를 분자·분모·항·gate 단위로 쪼개 이 글에서의 뜻을 라벨로 달고, annotation 첫 줄의 범용 문장과 `idea`를 잘라 붙인 줄(문장 중간에서 끊긴 것 포함)을 글의 `interpretation` 수치로 바꿈
- `=`를 가로지르거나 연산자 한쪽만 잡던 underbrace도 고침(예: rapidsnark `p_w=\underbrace{p_z\land…}`, BuiltinVars `\underbrace{\lceil…\rceil=\lfloor…\rfloor}`, rqbit·expected-consensus에서 식 세 개/두 개를 한 underbrace로 묶은 것)

## 파일별

| 파일 | 식 | 대표 after 라벨 |
|---|---|---|
| `ethereum/reth-trie/StateRoot.tsx` | 1 | header의 state root · 주소를 hash한 path · account leaf value |
| `filecoin/bittorrent.tsx` | 1 | 검증할 piece 수 · 나머지는 한 piece 더 |
| `filecoin/expected-consensus/ModernArticle.tsx` | 1 | epoch당 기대 leader · provider power 지분 · j번 당첨될 확률 |
| `gpu/cuda-shared-memory/BankConflict.tsx` | 1 | 32-bit word index · 32 bank 순환 |
| `gpu/cuda-shared-memory/Coalescing.tsx` | 1 | lane이 쓴 byte · 실제로 옮긴 byte |
| `gpu/cuda-shared-memory/Overview.tsx` | 1 | global bytes per use · tile의 global 왕복 · on-chip 재사용 횟수 |
| `gpu/cuda-sync-streams/Streams.tsx` | 1 | chunk 간격 · 가장 느린 stage |
| `gpu/cuda-thread-hierarchy/BuiltinVars.tsx` | 1 | launch할 block 수 · 나머지면 block 추가 · 정수 나눗셈 구현 |
| `gpu/gpu-arch-hopper/ModernArticle.tsx` | 1 | 느린 단계가 cadence · 처음 채우기 · 나머지 tile · 마지막 비우기 |
| `gpu/gpu-proof-pipeline/ModernArticle.tsx` | 1 | 자기 측정 시간 · 가장 늦은 선행 완료 · 가장 늦은 sink 완료 |
| `gpu/icicle-framework/ModernArticle.tsx` | 1 | buffer 재사용 시각 · 마지막 consumer 완료 |
| `gpu/rapidsnark-gpu/ModernArticle.tsx` | 1 | 같은 scalar field · 변수 수 일치 · public 수 범위 · 지원 domain |
| `hw/b300-switchless-network/Measurement.tsx` | 1 | 16 link nominal 합 · bit를 byte로 · 측정 busbw · line rate 기준 |
| `hw/b300-switchless-network/Topology.tsx` | 1 | pair당 cable · node pair 수 · node당 사용 port · OSFP port 8개 |
| `hw/memory/DDR.tsx` | 2 | 초당 transfer 수 · transfer당 byte · 독립 channel 수 · CAS cycle 수 |
| `hw/nvme-storage/ModernArticle.tsx` | 1 | - · - · 경로 중 가장 좁은 구간 |
| `hw/storage-comparison/ModernArticle.tsx` | 2 | 하루 host write · drive usable 용량 · 복구할 실제 bytes · 지속 rebuild 대역폭 |
| `isms-aml/aml-controls-article.tsx` | 2 | 제한 운영 투입 · CDD · 모니터링 · case 결정 |
| `isms-aml/compliance-evidence-article.tsx` | 1 | 처리방침 공개 · inventory · notice · 선택 enforcement |
| `isms-aml/isms-operations-article.tsx` | 3 | 복구 승인 · 원인 제거 · identity 정리 · 서비스 검증 |
| `isms-aml/isms-auth-management.tsx` | 1 | 후보 전체 계산 시간 · 유효 병렬도 |
| `isms-aml/isms-practical-guide.tsx` | 1 | 증거 chain 완결 건수 · 같은 범위 전체 모집단 |
| `isms-aml/vasp-operations-article.tsx` | 3 | snapshot 검증 자산 · 포함된 고객 채무 · 출금 release · 고객 의도 |
| `p2p/dht-security.tsx` | 1 | 같은 group peer 수 · 선택된 peer 수 |
| `p2p/kad-lookup.tsx` | 1 | 가까운 k개만 · target XOR 거리순 · 기존+응답 후보 dedup |
| `p2p/libp2p-gossipsub/ModernArticle.tsx` | 1 | topic 기여, cap 제한 · application · IP·behavior 감점 |
| `p2p/libp2p-quic/ModernArticle.tsx` | 1 | stream credit · connection credit · congestion window |
| `p2p/nat-traversal.tsx` | 1 | 약한 쪽 priority · 강한 쪽 tie-break · controlling role bit |
| `p2p/rqbit/ModernArticle.tsx` | 1 | 첫 byte의 piece · 마지막 포함 byte · 걸치는 piece 수 |
| `tee/hw-security/ModernArticle.tsx` | 1 | key 자동 지급 · 기밀성 · measurement 무결성 · freshness |
| `tee/platform-tee-article.tsx` | 1 | effect commit · session · command · memory 검증 |
| `tee/security-release-article.tsx` | 1 | secret 지급 · quote 서명 · nonce · log replay |
| `tee/tee-attestation/ModernArticle.tsx` | 1 | key release · 서명 chain · nonce · measurement |
| `tee/tee-memory/ModernArticle.tsx` | 1 | key K 암호화 · 입력 전 tweak · 출력 후 tweak |
| `tee/tee-tcb/ModernArticle.tsx` | 1 | 직전까지의 누적 값 · 새 event digest |
| `tee/vendor-tee-article.tsx` | 1 | 직전 ledger digest · event type · 주소 · page digest |

합계: 36개 파일, 43개 식, operation 85개.

## 대표 before/after

bittorrent.tsx
- before: `n_p=\underbrace{\left\lceil\frac{L}{P}\right\rceil}_{\text{기준량당 비율}}` + `["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","앞쪽 piece는 같은 P byte로 자르고 마지막","remainder만 짧게 둔다."]`
- after: `\underbrace{n_p}_{\text{검증할 piece 수}}=\underbrace{\left\lceil\frac{L}{P}\right\rceil}_{\text{나머지는 한 piece 더}}` + `["전체 길이 L을 P byte piece로 자른 개수","나머지가 있으면 짧은 마지막 piece를 더함","900 MiB/4 MiB=225, 901 MiB면 226"]`

tee-attestation (Boolean gate 계열 12개 공통 패턴)
- before: `R=\underbrace{S\land N\land M\land T\land B}_{\text{판정 조건 결합}}` + `["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.", …]`
- after: 각 문자에 `terms`의 뜻(서명 chain·nonce·measurement·TCB·channel binding)을 underbrace로 달고, annotation은 `interpretation`의 반례(`S=1이어도 reused nonce면 N=0 → R=0`)로 바꿈

## 검증

- 2차 grep(`판정 조건 결합|경계 후보 선택|…|계산한 양을 허용 경계와 비교해`): 0건. 1차 기계 마커 grep: 0건
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과(exit 0)
- `npx eslint <36 files>`: 0 error / 0 warning
- KaTeX `throwOnError:true` 렌더: 36개 파일의 식 66개 전부(`formula`, `annotatedFormula`, 모든 `operations[].expression`) 오류 0
- 모든 expression이 공백 정규화한 `formula`의 실제 부분 문자열인지, 같은 식 안 중복 expression 여부, annotation 1~3줄·줄당 34자 이하, `\text{}` 안 `\`·`^`·`_`·그리스 문자 부재를 스크립트로 확인: 수정한 43개 식 위반 0
- TypeScript 파서(transpileModule) 구문 진단: 36개 파일 0건
- `npx tsc -b --noEmit`: 저장소 전체 빌드가 Node heap 4 GB에서 OOM으로 중단돼 결과를 얻지 못함. 대신 위 구문 검사로 대체

## 검토 필요

- `filecoin/expected-consensus/ModernArticle.tsx:52` (이번 grep 목록 밖): fork-choice weight 식이 `\text{변화량 계산}` 라벨과 `인접한 level의 차이를 남겨 변화량을 계산합니다.` annotation(4줄)을 그대로 가진 범용 템플릿. 이번 문구 목록에 없어 손대지 않음
- `filecoin/expected-consensus/ModernArticle.tsx:28`: `idea`는 "QAP 지분 s"라고 하지만 `formula`는 `p/P`를 씀(기호 s가 식에 없음). annotation은 `p/P`로 맞춤. 식 오류는 아니고 idea 표기 불일치
- `tee/platform-tee-article.tsx:81` (이번 대상 밖): `\text{app\_id}`. KaTeX는 렌더하지만 브리프의 `\text{}` 안 `_` 금지 규칙에 걸림
- `gpu/gpu-proof-pipeline/ModernArticle.tsx:94`, `gpu/rapidsnark-gpu/ModernArticle.tsx:52` (이번 대상 밖): `\text{}` 안의 `→`·`×`가 KaTeX strict 경고(unknownSymbol)를 냄. 오류는 아님
- `formula` prop 자체에서 확실한 오류는 찾지 못함(Poisson 0.607/0.303, ICE pair priority RFC 8445, DDR CAS 10 ns, rebuild 4.4 h, coalescing 12.5%, rqbit piece 경계 계산 재확인)
