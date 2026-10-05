# Groth16의 같은 두 줄 실행

이 디렉터리의 Rust/Python은 글의 별도 검산 예제입니다. `../codebase`의 ark-groth16 v0.6.0 원문은 수정하지 않았습니다. `PROVENANCE.json`에 Git blob과 SHA256을 기록했고, 의존성은 Cargo.lock으로 고정했습니다. 의존 원문 중 화면에서 읽는 파일도 별도 보존했습니다.

## 실행

저장소 루트에서 실행합니다. Rust 1.93.0에서 관측했으며 `CARGO_TARGET_DIR`은 이 작업 전용 재생성 캐시입니다.

```sh
python3 -B src/pages/articles/blockchain/groth16/verification/trace.py
CARGO_TARGET_DIR=/tmp/teach-groth16-target cargo run --locked --release --manifest-path src/pages/articles/blockchain/groth16/verification/Cargo.toml
CARGO_TARGET_DIR=/tmp/teach-groth16-target cargo run --locked --manifest-path src/pages/articles/blockchain/groth16/verification/Cargo.toml -- --invalid-only
```

개발 빌드의 불량 답안은 원문 debug_assert에서 panic하며 예제에서 catch해 `panicked:true`를 출력합니다. stderr의 panic 메시지는 이 관찰의 일부입니다. release는 Proof 값을 반환하지만 검증은 false입니다. 전체 라이브러리 테스트를 실행한 것은 아닙니다.

## 관측 범위

- Python은 F101의 두 행 QAP와 노출된 지수 장부만 검산합니다. 10,201개의 r/s에 대해 완전성 등식과 A/B 지수 쌍의 전단사를 확인했지만 실제 곡선이나 보안 증명이 아닙니다.
- Rust는 공개 (3,144), 비공개 (4,12)의 두 제약과 실제 BN254를 사용합니다. 실제 QAP는 공개 자리 추가 및 padding을 포함해 8개 평가점을 씁니다. F101 손계산의 h=72와 동일한 배열이 아닙니다.
- 같은 키와 증명에서 잘못된 공개값·순서·배열 길이를 비교했습니다. v0.6.0의 zip은 긴 배열의 남은 값을 읽지 않습니다. 별도 `checked_verify`는 두 공개값 및 이 프로필의 128바이트를 요구합니다.
- 실제 압축/비압축 크기와 검사하는 역직렬화, 남는 바이트, 비곡선 (1,1), 항등원 세 점을 관찰했습니다. 모든 부분군·비정규 인코딩·자원 소모 사례를 전수 검사하지 않았습니다.
- −4·−12도 원래 관계를 만족합니다. 제곱 제약을 뺀 별도 관계의 키는 y145를 허용합니다. 양수성·정수 범위·출처나 권한은 이 회로에 없습니다.
- 원문의 coset 계산에 쓰인 생성원 5에서 불량 witness_map 결과가 숫자 등식을 만족하지만 7/11에서는 실패합니다. 한 점 검산을 다항식 항등식으로 확대하지 않습니다.

고정 설정 시드와 r/s는 재현용입니다. 공동 설정·비밀 폐기·안전한 난수 공급·전체 보안·상용 배포·측면 채널·양자 내성·성능은 검증하지 않았습니다.
