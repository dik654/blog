# 세계 이해·기술·금융 보강 검증

기준일: 2026-10-04. 본문 보강과 정적·전체 화면·최종 빌드 검증을 마쳤다. 배포 확인은 아래 진행 상태에 기록한다.

## 내용과 학습 경로

| 항목 | 결과와 근거 |
|---|---|
| 공개 정본 | 780→799편, 신규 19편 |
| 기존 학습 계약 | 50편 갱신, 나머지 730편 동일, 삭제 0. [객체 값 비교](world-systems-learning-changes.json) |
| 개념 | 3,765→3,837개, 신규 72개·기존 정의 93개 보강·삭제 0. [개념 목록](world-systems-concept-changes.json) |
| 개념 관계 | 6,124개, 소유권·경로·고립·단계 검사 통과 |
| 설명 방식 | 기존 세계 이해 29편과 이번 심화 정본에 teach-system 적용. 작은 수치 사례를 같은 글 끝까지 추적하고 원문·실제 코드에 적용 |
| 금융 | ETF·ETN·일일 레버리지·차입·커버드콜·분배금·구조화증권 등 [29개 상품·주제](financial-products-coverage-audit.md) |
| 국가·세계 공통 영역 | 250개 통계 지역 탐색, 인구·이주·돌봄·문화·규범·과학적 근거·자원 순환 정본 추가 |
| 점포·사업 | 입지→임대→공사→일상 운영→양도→폐업·원상복구, 토지개발·프랜차이즈의 돈과 책임 연결 |
| AI·GPU | 최신 원 논문과 고정 소스, CUDA·AMD·HBM의 숫자·주소·병목 구분 |
| Web3·암호 | Robinhood Chain·Hyperliquid·Ethereum 변경 상태, ZK 비용·건전성, 양자 계산·PQC·QKD·계정 전환 |

각 분야의 포함 범위·정본·1차 자료는 [누락 검수표](world-systems-gap-audit.md)에서 확인한다. 개별 발행 상품, 모든 국가의 법률, 모든 기존 문장을 전면 재검증한 목록이라는 뜻은 아니다.

## 신규 19편

- [월드모델 계획: 행동을 미리 비교하고 관측으로 다시 고치기](https://dik654.github.io/blog/cs/ai/world-model-latent-planning/)
- [레포는 증권을 맡겨 짧은 돈을 구하고 만기마다 다시 연결한다](https://dik654.github.io/blog/finance/banking/repo-and-collateral-funding/)
- [Glamsterdam: ePBS와 블록 접근 목록의 실행 경로](https://dik654.github.io/blog/cs/blockchain/glamsterdam-block-execution/)
- [Robinhood Chain: 전송 확정·브리지 인출·Stock Token 권리](https://dik654.github.io/blog/cs/blockchain/robinhood-chain-settlement/)
- [가게의 하루는 주문·재고·직원·입금을 맞추어 끝난다](https://dik654.github.io/blog/economics/business/shop-daily-operations/)
- [ML-KEM: 오류를 섞은 계산에서 두 사람이 같은 비밀을 얻는 과정](https://dik654.github.io/blog/cs/crypto/ml-kem-and-noisy-equations/)
- [양자내성 서명: ML-DSA의 가린 응답과 SLH-DSA의 해시 나무](https://dik654.github.io/blog/cs/crypto/post-quantum-signatures/)
- [증명기 메모리와 검증 비용](https://dik654.github.io/blog/cs/crypto/prover-memory-and-verifier-cost/)
- [양자컴퓨터는 어떤 계산을 바꾸고 어떤 암호를 위협할까](https://dik654.github.io/blog/cs/crypto/quantum-computing-and-cryptographic-risk/)
- [양자키분배: 12개 신호에서 비밀 키까지](https://dik654.github.io/blog/cs/crypto/quantum-key-distribution/)
- [AMD GPU 실행 구조와 CUDA에서 HIP으로 옮기는 경로](https://dik654.github.io/blog/cs/gpu/amd-gpu-execution-and-hip/)
- [HBM 적층 구조에서 코드의 메모리 요청까지](https://dik654.github.io/blog/cs/gpu/hbm-stack-and-memory-requests/)
- [자원과 폐기물은 수거된 양·다시 쓸 양·비용을 나눠 읽는다](https://dik654.github.io/blog/economics/infrastructure/materials-waste-and-circularity/)
- [문화와 규범은 서로의 행동을 예상하고 함께 일하는 방식을 바꾼다](https://dik654.github.io/blog/economics/institutions/culture-norms-and-coordination/)
- [숫자를 믿기 전에 무엇을 재고 무엇과 비교했는지 묻는다](https://dik654.github.io/blog/economics/institutions/evidence-measurement-and-causality/)
- [인구·이주·돌봄은 사람 수를 일할 시간과 생활 수요로 바꾼다](https://dik654.github.io/blog/economics/institutions/population-migration-and-care/)
- [커버드콜은 상승 일부를 팔아 현금을 받고 주가 하락은 감당한다](https://dik654.github.io/blog/finance/markets/covered-calls-and-income-funds/)
- [금융상품은 누가 언제 무엇을 지급하는지로 구별한다](https://dik654.github.io/blog/finance/markets/financial-products-and-claims/)
- [유동화는 대출의 현금흐름을 옮기고 손실을 받는 순서를 나눈다](https://dik654.github.io/blog/finance/markets/securitization-and-tranches/)

## 검증 방법

- 숫자·단위·권리·손실 순서와 성립 조건을 원문 및 별도 계산으로 대조했다. AI·ZK·양자 사례와 국가 탐색의 [재현 결과](world-systems-numeric-validation.json)를 저장했다.
- 실제 코드 파일은 버전 또는 commit과 LICENSE를 보존했다. 교육용 의사코드와 공식 원문을 구분했다. GPU 실행·학습·암호 해독 성능을 이 환경에서 재현했다는 주장은 하지 않는다.
- 본문 산문은 humanize 추출→마커 왕복→윤문→gate→재적용을 거쳤다. 숫자·고유명사·답 절을 보존했다. 일부 수학 tuple을 각주로 오인한 자동 경고는 원문과 별도 불변성 검사로 검토했으며 자동 PASS로 바꾸지 않았다.
- 점포 영상은 실제로 확인한 영상 프레임·게시자 전사·설명 페이지 범위를 구분했다. [영상 검증 기록](retail-video-verification-2026-10-04.md).
- 공개 entry가 실제 불러오는 파일만 감사하도록 source closure를 바로잡았다. 위반을 심은 양성 테스트와 기존 route 테스트 8개가 통과했다. [감사 범위와 제한](audits/public-source-scope-2026-10-04.md).

## 정적 검사와 빌드

[명령별 결과](audits/world-systems-static-2026-10-04.json): learning, graph, formula, articles, Viz, topology, reading, order, prose, terms의 strict 검사와 ESLint, TypeScript가 통과했다.

- Learning 799편 전부 등록·기초6/심화4·답변 section·선수 경로 검사를 통과했다.
- 수식 1,418개가 명시적 연산 주석을 갖는다. 주석 누락과 raw display 위반은 0이다.
- 읽기 순서 91개 목록·437개 선수 관계를 검사했다.
- Article material 위반 0. 비차단 설명 힌트 63개와 SVG 텍스트 REVIEW 4,025개는 자동 오류가 아니며 화면 검사의 대상으로 남겼다.
- 직접 작성한 파일의 공백 검사는 통과했다. 고정한 upstream codebase 8개 파일의 원래 공백·CRLF·마지막 빈 줄은 원문 일치를 위해 보존하고 별도 기록했다.
- Production build는 정적 주소 1,679개와 404 fallback을 생성했다. Vite의 큰 chunk 안내는 기존 전역 콘텐츠 번들의 크기 경고이며 빌드 오류는 아니다.

## 실제 화면

[화면 검수 요약](public-route-browser-audit.md)과 [화면별 기록](audits/public-route-browser-2026-10-04.json)은 799개 정본 각각의 390×844·1440×1000 결과를 보존한다. 수업 안내→본문→복습 순서, 용어 카드 250px 이상, 문서·수식·SVG 넘침과 application console을 검사했다.

공통 도식의 조작부 이동, 모바일 코드 목록, 개별 SVG 축 숫자, 줄바꿈, 차트 높이 문제를 고쳤다. 수정 전 검사와 추가 재검사 752개 화면을 구별해 병합했고, 1,598개 화면의 미해결 항목은 0이었다. 동일한 세로 축소 패턴의 152편·304개 화면과 내부 스크롤 1,244개 상태도 확인했다. 접힌 학습 도식을 연 뒤 컷 전환, 내부 스크롤, 실제 코드 패널 열기, 국가 검색·선택·빈 결과도 별도로 확인했다.

검증은 Chromium과 두 화면 폭 기준이다. 모든 브라우저·모든 입력 조합을 검사했다는 뜻은 아니다.

## 배포

상태: 최종 배포 확인 중. GitHub Pages 배포 실행과 운영 URL 검증 결과를 확인한 뒤 이 항목을 닫는다.
