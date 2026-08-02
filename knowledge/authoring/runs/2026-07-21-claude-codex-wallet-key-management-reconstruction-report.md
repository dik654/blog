# Claude-Codex wallet key-management reconstruction report

이 문서는 SSS, MPC, TSS, deterministic key generation, serverless·embedded·non-custodial wallet을 제품 이름 목록이 아니라 권한과 실패 경계로 재구성한 판단 기록이다.

## 1. 현재 문제에서 시작한 이유

최근성은 Shamir나 MPC 원리의 탄생이 아니라, 소셜 로그인·브라우저·TEE·smart account·정책 엔진과 threshold signing이 한 제품에 결합되는 데 있다. 그래서 첫 질문을 “키가 어디 저장되는가”가 아니라 “누가 정상 서명, 복구, 정책 변경과 서비스 이탈을 통제하는가”로 바꿨다.

```text
현재 wallet 권한 지도
-> SSS 복구와 TSS 서명의 실행 차이
-> DKG·refresh·resharing lifecycle
-> browser/WASM/WebCrypto의 실제 격리 경계
-> OAuth identity와 transaction intent의 분리
-> 기존 MPC 구현으로 내려가 protocol round 확인
```

## 2. 소유권과 최소 기반

- `wallet-key-management-map`: custody를 signing/recovery/policy/service 권한 그래프로 분해
- `threshold-wallet-signing`: SSS, MPC, TSS, FROST, threshold ECDSA와 DKG
- `browser-wallet-recovery`: deterministic share, HKDF entropy, WASM, WebCrypto, OAuth와 recovery
- `mpc`: 선택한 Shamir·Paillier·threshold ECDSA 구현 경로

지갑 서비스별 홍보 문서를 한 글씩 만들지 않았다. 새로운 trust boundary나 실행 protocol을 소유할 때만 독립 글로 승격한다.

## 3. 비공개 전이 문제

- OAuth session은 탈취됐지만 device share가 없을 때 보호되는 것과 남는 위험은 무엇인가.
- `HKDF(publicSalt, email)`이 안전한 wallet share source인가.
- 2-of-3 Shamir에서 reconstruct-then-ECDSA를 하면 메모리에 무엇이 생기는가.
- 2-of-3 FROST에서 한 signer가 offline일 때 서명 가능한가, 왜 원본 secret은 복원되지 않는가.

마지막 문제를 위해 참여 집합의 Lagrange 계수를 각 signer가 자기 partial signature 안에서만 반영하고, 두 online signer가 두 round를 끝내면 성공하지만 중간 이탈 시 새 session이 필요하다는 조건을 명시했다.

## 4. 출처와 경계

- NIST IR 8214C final, 2026-01-20: threshold scheme 공개 모집과 평가 package의 현재 기준. 표준화 완료를 뜻하지 않는다.
- RFC 9591: FROST의 2-round Schnorr threshold protocol. 모든 EdDSA나 threshold ECDSA를 설명하지 않는다.
- RFC 5869: HKDF의 input keying material 가정. 공개 identifier에 entropy를 만들지 않는다.
- OpenID Connect Core와 OAuth Security BCP: identity session의 계약. Blockchain transaction authorization은 별도다.
- W3C WebCrypto/Wasm: API와 sandbox 범위. Secure enclave나 transaction intent 보장은 아니다.

## 5. Claude 반례 검토와 수정

Claude는 OAuth, HKDF와 SSS 문제를 통과시켰고 FROST offline 조건의 누락을 지적했다. 해당 문장을 추가하고 canonical OIDC URL로 교체했다. NIST final 날짜는 공식 CSRC에서 재확인했다. 기존 MPC 글에서는 `n >= 2t+1` 같은 보편화, integer Shamir, 원본 키를 만드는 가짜 partial-signature 수식과 Paillier의 보편 MPC 표현을 제거했다.

## 6. 검증 결과

- 변경 파일 ESLint와 production build 통과
- 4개 경로, desktop/mobile 8회 검사: runtime error 0, overflow 0, KaTeX error 0
- 모바일 최소 수식 scale 0.92
- custody, authorization intent, reconstruct/threshold, OAuth 위협 상태 전환 확인
- crypto category에서 현재 권한 지도와 threshold 글 연결 확인

## 7. 작은 모델 재현 packet

4B 모델에는 한 threat scenario와 `asset, authority, quorum, failure, recovery, source` IR만 준다. 9B 모델에는 정상 경로와 실패 경로를 한 쌍으로 주고, “원본 키가 실행 중 존재하는가”와 “로그인만으로 거래가 승인되는가”를 private test로 둔다. Orchestrator는 protocol family, 공식 규격 날짜, 제품 주장과 암호학 보장의 경계를 최종 검증한다.
