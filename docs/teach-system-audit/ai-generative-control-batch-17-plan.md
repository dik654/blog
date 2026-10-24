# AI 이미지·영상 생성 조정 묶음 17

## 범위

- `ai/image-video-lora-architecture` — 개념
- `ai/multi-component-finetuning-vram` — 실무
- `ai/generative-measurement-controls` — 실무
- `ai/masked-edit-verb-routing` — 실무
- `ai/removal-is-not-inpainting` — 실무
- `ai/roi-resolution-identity-budget` — 실무
- `ai/reference-identity-pose-separation` — 개념
- `ai/generative-identity-diversity` — 참고

## 직속 부모 지도

`이미지·영상 생성 → {공통 준비: 어댑터 범위 → 메모리 예산 → 계측기 검증 | 편집 도구: 편집 의도 → 삭제 계약 → 대상 해상도 | 정체성 제어: 신호 분리 → 다양성 진단}`

## 변경 원칙

- 서로 다른 실험을 억지로 한 줄의 실행 절차로 만들지 않고, 공통 준비 뒤에 편집 도구와 정체성 제어가 갈라지는 구조로 보여 줍니다.
- 각 글은 지도에서 현재 위치와 하나의 질문을 먼저 보여 주고, 첫 동작 그림을 설명문보다 앞에 둡니다.
- 실험값은 해당 장비·모델 조합의 측정으로 한정하고 다른 모델의 성능으로 일반화하지 않습니다.
- 핵심 동작 그림은 사용자가 명시적으로 재생하기 전에는 움직이지 않으며, JavaScript 비활성 상태에는 모든 장면의 순서와 결론을 남깁니다.
- 모바일에서는 지도의 현재 단계 설명만 펼치고, 모든 그림에서 가로 이동과 글자 잘림을 없앱니다.

## 검증

- [x] 데스크톱 1440×1000
- [x] 모바일 390×844
- [x] 문서·그림 가로 넘침과 SVG 글자 잘림 없음
- [x] 부모 지도와 현재 단계 링크 일치
- [x] 키보드 장면 이동과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 전체 장면
- [x] 전체 build 및 strict audit
- [ ] 공개 경로 배포 확인
