# 지갑 키 관리 current-first 경로

## 독자 목표

소셜 로그인 기반 지갑, MPC wallet, serverless wallet이라는 제품 문구를 보았을 때 다음 질문에 답할 수 있어야 한다.

1. 누가 어떤 조건에서 유효한 서명을 만들 수 있는가?
2. 한 장치·한 서버가 침해되거나 사라져도 자산 통제권과 복구 가능성이 어떻게 달라지는가?
3. SSS, MPC, TSS, DKG는 각각 저장·계산·서명·키 생성 중 무엇을 담당하는가?
4. OAuth 로그인 성공이 왜 거래 서명 승인과 같지 않은가?
5. 브라우저, WASM, WebCrypto, TEE는 어떤 위협만 줄이며 무엇을 보장하지 않는가?

## 경로와 소유권

### 00 · 지갑 키 관리 지도

- 최신성: 원리는 오래됐지만 NIST Threshold Call 2026과 embedded wallet 제품화가 현재의 변화다.
- custody를 제품 이름이 아니라 `서명 권한`, `복구 권한`, `정책 변경 권한`, `서비스 의존성` 축으로 분해한다.
- custodial, self-custody, embedded, threshold, smart wallet, serverless를 상호 배타적 분류로 제시하지 않는다.
- 다음 글에서 해결할 질문만 남긴다.

### 01 · SSS에서 MPC/TSS까지

- SSS는 비밀 분산 프리미티브이며 서명 프로토콜이 아니다.
- 단순 복구 경로에서는 threshold share를 모아 키를 재구성할 수 있다.
- threshold signing에서는 share를 유지한 채 공동 계산한다.
- DKG, resharing, refresh, proactive security를 signing과 분리한다.
- Threshold ECDSA와 FROST/Schnorr의 round·nonce·aggregation 차이를 과도하게 일반화하지 않는다.

### 02 · 브라우저·서버리스 복구 위협 모델

- `serverless`는 표준 암호학 보안 속성이 아니라 배포·마케팅 용어다.
- `HKDF(salt, UID)`는 공개·저엔트로피 입력을 고엔트로피 비밀로 만들지 못한다.
- OAuth/OIDC 인증, 거래 정책 결정, 명확한 transaction authorization, 실제 서명을 분리한다.
- WASM sandbox, WebCrypto non-extractable key, OS secure hardware의 보장 범위를 분리한다.
- 백업, 복구, rotation, provider outage를 happy path와 같은 비중으로 다룬다.

### 03 · 프로토콜 구현

- 기존 `mpc` 글은 특정 tss-lib의 Shamir·Paillier·threshold ECDSA 구현 심화로 소유권을 좁힌다.
- 일반 MPC 정의와 특정 프로토콜의 조건을 혼동한 문장을 수정한다.

## 비공개 검증 문제

### A · 로그인 탈취

Google OAuth 세션을 공격자가 탈취했지만 device share는 없고 policy server는 로그인만 확인한다. 공격자가 서명할 수 있는가? 답은 제품 구조에 따라 달라지며, 인증과 거래 승인·signing quorum을 분리해 추론해야 한다.

### B · 결정론적 share

`share = HKDF(publicSalt, email)`이고 저장을 하지 않는다고 한다. 왜 serverless여도 안전하지 않은가? KDF가 입력 엔트로피를 만들지 못하고 이메일 후보를 offline 대입할 수 있음을 설명해야 한다.

### C · 2-of-3 복구

브라우저, 서비스, 백업 share 중 2개로 키를 복원한 뒤 일반 ECDSA를 실행한다. 이를 threshold ECDSA라고 불러도 되는가? SSS recovery와 threshold signing을 구분해야 한다.

### D · 한 signer 오프라인

2-of-3 FROST에서 한 signer가 오프라인이고 두 signer가 정상이다. availability는 유지되지만 nonce 재사용, malicious coordinator, share theft가 남는 이유와 필요한 control을 설명해야 한다.

## 작성 계약

- 제품 이름보다 trust boundary와 failure scenario를 먼저 쓴다.
- `non-custodial`, `self-custody`, `serverless`는 주장만 반복하지 말고 누가 단독 서명·복구·정책 변경 가능한지로 검증한다.
- 수식의 underbrace는 한글로 연산 이유를 표시하고 모바일 축소율 0.75 이상을 목표로 한다.
- 시각화는 좁은 화면에서 한 열로 재배치되며 내부 가로 스크롤을 만들지 않는다.
- NIST·IETF·W3C·OpenID 같은 1차 규격을 우선하고 vendor 문서는 제품 사례로만 쓴다.
