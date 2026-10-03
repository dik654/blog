# Web3·양자 보안 8편 최종 검수 기록

확인 기준일: **2026-10-04**
상태: **아래 8편의 정본 작성·보강과 내용 검수 완료**

이 기록은 Web3 6편과 양자내성 계정, 양자키분배 각 1편을 다룹니다. 문서의 현재 상태, 교육용 숫자, 실제 측정 결과를 구분했습니다. 각 글은 하나의 사례를 10단계 설명으로 이어 가며, 기초 6문제와 심화 4문제의 정답 기준을 등록했습니다.

## 검수 범위

| 글 | 끝까지 확인하는 질문 | 반영 결과 |
|---|---|---|
| [Robinhood와 블롭 수요](/cs/blockchain/robinhood-chain-blob-demand) | 사용량 증가와 특정 체인의 기여를 어떻게 증명하는가? | 관측 근거가 없는 주장을 제거하고 비용 분기와 집계 사례 보강 |
| [Hyperliquid](/cs/blockchain/hyperliquid) | 주문 뒤 체결·담보·청산·자금 이동은 어떻게 이어지는가? | 같은 주문의 수수료와 청산 계산, 현재 USDC 경로 보강 |
| [Ethereum 로드맵](/cs/blockchain/ethereum-future-roadmap) | 제안·시험·메인넷 적용을 어떻게 구분하는가? | EIP 상태와 업그레이드 포함 단계를 분리 |
| [RWA의 권리와 회수](/cs/blockchain/rwa-composition) | 토큰을 받아서 은행 현금을 회수할 때까지 어떤 권리가 필요한가? | BUIDL의 기관 역할과 실제 교환 경로 보강 |
| [Robinhood Chain 결제](/cs/blockchain/robinhood-chain-settlement) | 빠른 전송 확인은 언제 실제 지급과 법적 권리가 되는가? | 독립 정본 작성 |
| [Glamsterdam 블록 실행](/cs/blockchain/glamsterdam-block-execution) | 블록 제작·자료 공개·실행 검증은 무엇이 다른가? | 독립 정본과 고정 원문 코드 작성 |
| [양자내성 계정 이전](/cs/blockchain/pq-account) | 서명을 바꾸면 계정의 모든 송금 권한도 바뀌는가? | 실제 계정 코드와 실패 경로로 전면 보강 |
| [양자키분배](/cs/crypto/quantum-key-distribution) | 측정값을 맞춘 뒤 어떤 조건에서 비밀 키를 승인할 수 있는가? | 독립 정본과 유한 표본·키 길이 계산 작성 |

## 1. Robinhood와 Ethereum 블롭 수요

**발견한 문제.** 종전의 평균 6.4와 Robinhood의 기여 주장을 재현할 쿼리, 게시 주소 분류, 블록 범위가 없었습니다. 단일 블록의 피크와 기간 평균을 섞었고, 코드에 있는 BPO 기본값을 실제 활성 설정으로 읽을 여지도 있었습니다.

**반영한 수정.** 관측 근거가 없는 수치는 시장 사실로 유지하지 않았습니다. 대신 네 블록의 사용량을 18·10·6·6으로 가정해 합계 40, 평균 10을 계산합니다. 특정 게시자의 14·2·2·2는 기간 전체의 50%이고 첫 블록에서는 약 77.8%라는 차이를 보여 줍니다. 실제 기여를 주장할 때 필요한 체인 ID, 블록 범위, 재조직 기준, 게시 주소와 미분류 자료의 처리도 명시했습니다.

고정한 go-ethereum 설정에서 BPO2의 목표 14, 상한 21, update fraction 11684671과 메인넷 활성화 시각을 함께 읽도록 바꿨습니다. BPO3·BPO4 기본값의 존재를 활성화 증거로 쓰지 않습니다. Sparse Blobpool의 0.15+0.85/8=0.25625는 제안의 평균 자료 수신 모형이며 실제 전체 네트워크 성능 측정과 구분했습니다. 근거는 [고정 go-ethereum 설정](https://github.com/ethereum/go-ethereum/blob/c9a2bc73c847319a8faa57de59e42c0efc420682/params/config.go), [EIP-7892](https://eips.ethereum.org/EIPS/eip-7892), [EIP-8070](https://eips.ethereum.org/EIPS/eip-8070)입니다.

**최종 추가 발견: EIP-7918 분기.** 18개 사용 뒤 초과분이 4가 되는 계산에는 실행 비용에 연동된 하한 분기가 작동하지 않는다는 전제가 필요합니다. 같은 첫 블록에서 그 분기가 작동하면 환산 증가분은 18×(21−14)/21=6입니다. 따라서 사용 개수만으로 실제 초과분이나 비용 경로를 확정할 수 없으며 부모 블록의 실행·blob base fee도 필요하다고 보강했습니다. [EIP-7918의 `calc_excess_blob_gas`](https://eips.ethereum.org/EIPS/eip-7918)를 직접 대조했습니다.

**검증 결과.** 합계·비율·분기별 산술을 확인했습니다. 공식 연결 문서의 메인넷과 Ethereum blobs 사용 설명은 네트워크 특성의 근거로만 사용했습니다. Robinhood의 실제 기간별 점유율은 이 글에서 측정한 결과가 아닙니다. [Robinhood Chain 연결 문서](https://docs.robinhood.com/chain/connecting/)

## 2. Hyperliquid 주문·담보·자금 이동

**발견한 문제.** 주문 제출과 체결이 구분되지 않았고, 담보 부족 계산에서 같은 주문의 수수료가 빠져 있었습니다. HIP-3 운영자의 권한, HIP-4 지급 구조, HyperEVM과 HyperCore의 실행 경계도 부족했습니다.

**반영한 수정.** 담보 1,000 USDC로 BTC 0.1개에 해당하는 계약을 50,000달러에 사는 사례를 끝까지 추적합니다. 처음 0.04개의 taker 수수료 0.90과 나중 0.06개의 maker 수수료 0.45를 합하면 1.35 USDC입니다. 미실현 손실 700과 펀딩 순지급 20을 반영한 계정 가치는 278.65입니다. 가정한 유지 요구액 300보다 21.35 부족하지만, 그 2/3인 backstop 기준 200 아래는 아니라는 점을 분리했습니다. 요율과 청산 규칙은 [공식 수수료 문서](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees), [공식 청산 문서](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations)와 대조했습니다.

**최종 추가 발견: 현재 USDC 경로.** 공식 문서는 native USDC 발행에 CCTP를 권장하고 기존 Arbitrum Bridge2를 deprecated로 표시합니다. CCTP의 출발지 소각, 발행자 인증, 도착지 발행, HyperCore 반영을 따로 설명했습니다. 기존 브리지의 최소 입금액과 입출금 시간은 CCTP의 조건으로 옮기지 않았습니다. deprecated 표기만으로 기존 브리지의 모든 기능이 즉시 중단됐다고 주장하지도 않습니다. [Hyperliquid USDC 문서](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/usdc)

HIP-3에서는 운영자의 가격 자료·종료 권한과 담보 구분을 설명합니다. HIP-4의 완전 담보·범위형 지급 구조는 무기한 계약의 레버리지 청산과 구별했습니다. 개요의 초기 메인넷 출시 설명과 deployer API의 Testnet-only 표기가 충돌하는 범위는 그대로 밝히고 모든 기능의 활성화나 지속적인 무료 거래로 확대하지 않았습니다. [HIP-3](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals), [HIP-4 개요](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-4-outcome-markets), [HIP-4 deployer API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/hip-4-deployer-actions)

**검증 결과.** 수수료·계정 가치·청산 기준을 같은 사례로 검산했습니다. [공식 SDK의 고정 commit](https://github.com/hyperliquid-dex/hyperliquid-python-sdk/tree/2fdb18f9517675ea03695a0962bd19eece9c83f0)으로 요청 생성과 조회 경로를 확인했습니다. 공개 SDK가 비공개 거래 엔진 전체를 보여 준다는 주장은 하지 않습니다.

## 3. Ethereum 로드맵의 현재 상태

**발견한 문제.** 연구 방향과 실제 포크 상태가 추상적으로 섞여 있었습니다. EIP 문서의 Review와 특정 업그레이드의 포함 예정 상태, 테스트넷 일정과 메인넷 적용을 구별할 기준이 부족했습니다.

**반영한 수정.** 2026-10-04에 운영자가 문서를 읽는 한 사례로 바꿨습니다. EIP-7773은 Review이며 Sepolia의 epoch 353024, timestamp 1791294816은 2026-10-06 13:53:36 UTC의 예정 일정입니다. 확인일에는 미래 일정이고 Hoodi·Mainnet 활성화 항목은 비어 있습니다. 문서 상태와 포함 단계는 [EIP-7723](https://eips.ethereum.org/EIPS/eip-7723), 실제 일정은 [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773)을 기준으로 구분했습니다.

Hegotá의 EIP-8081 Draft, FOCIL 7805·Frame 8141의 SFI, 선택적 실행 증명 8025의 PFI를 별도로 적었습니다. 소개 페이지의 예상 시기나 기능 목록이 활성화 증거를 대신하지 않도록 했습니다. [EIP-8081](https://eips.ethereum.org/EIPS/eip-8081), [Hegotá 소개](https://ethereum.org/roadmap/hegota/)

**검증 결과.** 시각 변환과 네트워크 구분을 대조했습니다. “날짜가 지났다”는 사실만으로 적용 성공을 판정하지 않고 실제 블록·클라이언트 설정·실행 결과를 확인하는 절차를 설명했습니다. 이 기록은 10월 6일 이후의 테스트넷 성공 여부를 선행 확인한 보고가 아닙니다.

## 4. RWA와 BUIDL의 권리·회수 경로

**발견한 문제.** 토큰 잔액, 법적 지분, 수탁 자산, 현금 상환을 연결하는 실제 기관 사례가 부족했습니다. 교육용 haircut 질문은 80%라고 적혀 있었지만 계산은 20%를 사용했습니다.

**반영한 수정.** 자산 105에서 부채 3을 뺀 순자산 102, 지분 100개의 개당 가치 1.02를 일관되게 사용했습니다. 20% haircut을 적용한 평가액은 81.60이며 특정 서비스가 승인한 대출 한도로 제시하지 않았습니다.

BUIDL은 개별 국채 그 자체가 아니라 펀드 지분이라는 점부터 설명했습니다. 출시 발표의 운용사, 수탁·관리기관, 명의개서기관을 구별하고 당시의 1달러 가치 목표와 초기 투자 조건을 모든 현재 지분 종류의 조건으로 확대하지 않았습니다. [Securitize의 BUIDL 출시 발표](https://investors.securitize.io/news/news-details/2024/BlackRock-Launches-Its-First-Tokenized-Fund-BUIDL-on-the-Ethereum-Network-03-20-2024/default.aspx)

지분을 Circle에 전달해 USDC를 받는 교환, Securitize 자격 확인을 거친 UniswapX 거래, USDC를 소각하고 은행 달러를 받는 상환을 별도 사건으로 연결했습니다. 토큰 전송의 원자성이 모든 투자자의 접근이나 은행 지급 완료를 보장하지 않는다고 설명했습니다. [Circle의 BUIDL 교환 발표](https://www.circle.com/pressroom/circle-announces-usdc-smart-contract-for-transfers-by-blackrocks-buidl-fund-investors), [Uniswap Labs의 2026년 BUIDL 연동 발표](https://blog.uniswap.org/unlocking-defi-liquidity-for-buidl), [Circle의 USDC 상환 안내](https://help.circle.com/support/en/tokenizing-and-redeeming-usdc?id=kb_article_view&sysparm_article=KB0010781)

**검증 결과.** 순자산·지분 가치·haircut 산술과 질문의 숫자를 일치시켰습니다. 가상 펀드의 1.02나 교환가 10.15를 BUIDL의 실제 관측 가격으로 쓰지 않았습니다. 발표문을 현재 청약 자격이나 모든 종류의 환매 권리를 확정하는 문서로도 사용하지 않습니다.

## 5. Robinhood Chain의 전송·인출·상품 권리

**발견한 문제.** 블롭 수요 글만으로는 사용자 자산의 이동을 설명할 수 없었습니다. 과거 testnet이라는 URL 이름을 현재 네트워크 상태로 읽거나, 전송 완료를 L1 지급 완료로 읽을 위험도 있었습니다.

**반영한 수정.** 독립 정본에서 A의 토큰 100개 중 10개를 B에게 보내고 B가 5개를 L1으로 인출하는 사례를 작성했습니다. 최종 잔액 A L2 90, B L2 5, B L1 5와 처리 중인 인출을 중복 없이 맞춥니다. 메인넷 4663과 테스트넷 46630, 빠른 확인과 L1 확정, 인출 대기와 claim 실행을 나눴습니다. [연결 문서](https://docs.robinhood.com/chain/connecting/), [확정 단계](https://docs.robinhood.com/chain/transaction-finality/), [브리지 문서](https://docs.robinhood.com/chain/bridging/)

Stock Token은 Robinhood Assets (Jersey) Limited가 발행한 채무증권의 조건으로 설명했습니다. raw balance 10을 기초 주식 10주의 직접 소유권으로 바꾸지 않고, 표시 비율과 자격·발행 창도 분리했습니다. 일반 TOK의 인출 사례가 모든 Stock Token에 지원된다는 주장도 제거했습니다. [Stock Tokens 공식 문서](https://docs.robinhood.com/chain/stock-tokens/), [발행 문서](https://docs.robinhood.com/rhj)

**검증 결과.** [고정 Arbitrum SDK](https://github.com/OffchainLabs/arbitrum-sdk/blob/cbb96c6f7f84d71bdef65d0fd9d3d7275a236711/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts)의 CONFIRMED와 EXECUTED를 실제 코드 패널로 확인했습니다. 이 SDK를 라이브 Robinhood 배포의 동일 bytecode라고 검증한 것은 아닙니다. 13분·7일 등의 통상 안내는 모든 거래의 지급 기한으로 쓰지 않습니다.

## 6. Glamsterdam의 블록 제작과 실행 검증

**발견한 문제.** ePBS와 블록 접근 목록을 이름과 전망만으로 설명하면 어느 단계가 실제 계산을 검증하는지 알기 어려웠습니다. 접근 목록을 받는 것과 실행 결과를 확인하는 것도 혼동할 수 있었습니다.

**반영한 수정.** X=100에서 첫 거래가 10을 빼고 다음 거래가 5를 더해 90→95가 되는 사례를 작성했습니다. 제작자의 bid, 실제 payload 공개, 자료 도착 확인, 실행 결과 검증을 구별합니다. 같은 X를 쓰는 두 거래와 서로 다른 X·Y를 쓰는 반례도 비교했습니다. [EIP-7732](https://eips.ethereum.org/EIPS/eip-7732), [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928)

[고정 consensus-specs](https://github.com/ethereum/consensus-specs/blob/889a389f9f95d2aba52aedf233217f370772dd3d/specs/gloas/beacon-chain.md)의 bid 지급 여력 검사와 [고정 execution-specs](https://github.com/ethereum/execution-specs/blob/a87891f7e69eab1f903233c61c5514d8c94bd5d1/src/ethereum/forks/amsterdam/fork.py)의 접근 목록 hash 검사를 실제 원문으로 연결했습니다. 0.01 ETH를 10,000,000 Gwei로 나타내는 지급 예와 X=95라는 실행 결과는 서로 다른 검사의 입력입니다.

**검증 결과.** 두 거래의 상태 변화, 지급 단위 변환, 잘못된 목록을 거절하는 경로를 대조했습니다. 개발 명세의 순차 표현을 실제 클라이언트의 병렬 성능 측정으로 쓰지 않았으며, 메인넷 활성화 여부는 로드맵 글의 확인 기준과 일치시켰습니다.

## 7. 양자내성 계정 이전

**발견한 문제.** 교육용 축약 코드와 단순 해시 식이 실제 계정 구현처럼 읽힐 수 있었습니다. 계정과 EntryPoint의 nonce 책임, 검증 실패와 실행 실패, 기존 owner의 우회 권한이 충분히 설명되지 않았습니다.

**반영한 수정.** [account-abstraction의 고정 원본](https://github.com/eth-infinitism/account-abstraction/tree/1c6b669d0eea734e09a87e095ba15e076151718a)을 사용하는 8개 코드 패널로 교체했습니다. 현재 `getUserOpHash`의 EIP-712 타입 해시와 domain, EntryPoint에서 NonceManager로 이어지는 실제 순번 검사, revert 시 되돌아가는 변경을 추적했습니다. [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)

송금용 잔액 1 ETH와 비용 예치금 0.02 ETH를 나눈 뒤 0.1 ETH를 보냅니다. 예약 0.003 중 최종 비용 0.001을 청구하면 예치금은 0.019 ETH, 환급은 0.002 ETH, 순번은 7→8입니다. 서명 실패와 수신자 실행 실패에서 남는 결과를 다르게 설명했습니다.

SimpleAccount가 ECDSA 예시임을 명시했습니다. 서명 검사 함수를 ML-DSA로 바꾸어도 owner의 직접 실행·업그레이드·복구 경로가 남으면 계정 전체 이전은 끝나지 않습니다. ML-DSA의 규격과 계정에서 실행 가능한 verifier·검증 gas·bundler 규칙도 분리했습니다. [SimpleAccount 원본](https://github.com/eth-infinitism/account-abstraction/blob/1c6b669d0eea734e09a87e095ba15e076151718a/contracts/accounts/SimpleAccount.sol), [FIPS 204](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf), [ERC-7562](https://eips.ethereum.org/EIPS/eip-7562), [NIST의 2026년 암호 전환 지침](https://csrc.nist.gov/pubs/cswp/39/upd1/considerations-for-achieving-crypto-agility/final)

**검증 결과.** 잔액 보존, 비용 단위, nonce 처리와 실패 분기를 원문과 대조했습니다. 8개 코드 패널을 두 화면 폭에서 열어 총 16회 확인했습니다. ML-DSA의 EVM 구현·실측 gas·제품 인증을 완료했다는 주장은 없습니다.

## 8. 양자키분배

**발견한 문제.** QKD의 독립 정본이 없었고, 일부 표본의 오류가 0이라는 사실을 전체 비밀성의 증거로 읽거나 도청 오류율 25%를 모든 공격의 보편 값으로 읽을 수 있었습니다.

**반영한 수정.** 12개 신호 중 기저가 같은 8개를 선별하고 2개를 공개 검사해 6개를 남깁니다. Alice의 010110과 Bob의 011110을 세 패리티 110으로 맞춘 뒤, 그 공개가 공격자의 후보를 64개에서 8개로 줄이는 낙관적 가정을 계산했습니다. 압축 결과 01은 시연일 뿐이며, 실제 QKD의 엔트로피 하한과 전체 보안 오차를 입증하지 않아 승인 키를 0비트로 처리합니다. 입력부터 중단까지 같은 숫자를 쓰는 교육용 의사코드도 추가했습니다.

전체 신호를 가로채 다시 보내는 이상적 모형에서는 기저가 일치한 기록의 오류율이 1/2×1/2=25%입니다. 그 모형에서 검사 2개가 모두 맞을 확률 9/16과, 오류 1개가 고정된 8개 중 2개를 뽑아 오류를 피할 확률 21/28은 다른 질문이라고 설명했습니다. [BB84 원문](https://arxiv.org/abs/2003.06557)

유한 키 추출의 거리 상계에 낙관적인 최소 엔트로피 3비트와 출력 2비트를 넣으면 약 0.354입니다. 이를 실제 공격 성공률이나 2비트 추출의 불가능성 증명으로 쓰지 않았습니다. 해당 논문의 특정 기저 배치용 키 길이 식을 이번 표에 그대로 대입하지도 않았습니다. [유한 키 분석 원문](https://arxiv.org/html/1103.4130v2)

장치 가정은 광원, 검출기, 신뢰 중계, 인증으로 나눴습니다. decoy-state·MDI·DI가 각각 줄이는 가정을 구분하고 DoS와 인증 필요성도 남겼습니다. NSA의 의견은 미국 NSS에 관한 권고로 한정했으며 그 페이지의 오래된 NIST 진행 설명을 현재 상태로 인용하지 않았습니다. PQC 인증 결합은 2026-03-16 승인된 ITU-T X.1711의 §7.2.2와 대조했습니다. [ITU-T X.1711](https://www.itu.int/rec/T-REC-X.1711), [NSA의 QKD 설명](https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/)

**검증 결과.** 패리티 행렬의 독립 관계 3개, 후보 8개, 압축값 01, 두 표집 확률, 거리 상계 약 0.353553을 독립 계산하고 원문과 교차 확인했습니다. 1440px와 390px에서 두 수식의 설명 순서와 의사코드 배치를 직접 확인했습니다.

## 공통 검증 결과와 완료의 범위

- **설명과 근거:** 8편 모두 사례 → 용어 → 처리 과정 → 원문 적용 → 반례·한계의 순서를 갖췄습니다. 코드 분석 글은 고정 commit과 원문·라이선스를 보존했고, 금융·제도와 QKD는 공식 문서·논문을 같은 사례에 적용했습니다.
- **학습 계약:** 글마다 기초 6문제와 심화 4문제를 등록했습니다. 해당 글의 학습 계약 및 시각화 정적 검사를 통과했습니다.
- **코드 패널:** Web3 4편의 11개 패널을 두 화면 폭에서 총 22회, 계정 글의 8개 패널을 총 16회 열어 확인했습니다. 실행 오류가 없었습니다.
- **화면:** 8편을 1440px와 390px에서 확인했습니다. 마지막 문장 수정 뒤에는 Hyperliquid, Robinhood 결제, 계정 이전, QKD의 8개 화면을 다시 검사했습니다. 페이지 가로 넘침, 좁은 칸의 긴 문단, 잘못된 문서 내 링크, 페이지 실행 오류, KaTeX 오류는 없었습니다.
- **한국어:** 산문을 별도로 추출해 수치·고유명사·인용과 질문의 답 위치를 보존하며 다듬었습니다. 마지막 4편은 humanize 검사 전 항목을 통과했습니다. 나머지 글의 연결어미·쉼표 통계 경고는 문맥을 직접 검토했으며 자동 점수 통과와 내용 검수를 같은 것으로 취급하지 않았습니다.
- **문장 구조와 타입:** 마지막 검사에서 수정한 4편의 압축 신호는 각각 기준 5 미만이었고 전역 문장 감사의 새 재검토 항목은 0건이었습니다. TypeScript 빌드도 통과했습니다. 기존 문장 감사 기준선을 새로 등록해 이 결과를 만든 것은 아닙니다.

완료 범위는 위 8편의 작성·보강과 명시한 내용·화면 검증입니다. 프로토콜의 미래 활성화, 실제 시장 점유율, 상용 암호 구현의 안전성, 블로그의 외부 배포는 각각 별도의 증거가 필요한 사실입니다. 영상 전체를 시청한 것으로 표시하지 않았으며, 이 8편의 기술·상품 주장은 확인한 공식 문서와 원문 코드·논문에 근거합니다.

### 검증 기록 위치

저장소 작업 기록에서 다음 결과를 대조할 수 있습니다.

- `output/playwright/web3-audit/2026-10-03T19-31-30/summary.json`
- `output/playwright/web3-code-panels/summary.json`
- `output/playwright/pq-account-final/2026-10-03T19-50-28/summary.json`
- `output/playwright/pq-account-code-panels/summary.json`
- `output/playwright/qkd-final/summary.json`
- `output/playwright/prose-four-final/summary.json`
