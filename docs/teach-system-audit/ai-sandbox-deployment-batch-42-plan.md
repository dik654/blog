# AI 샌드박스 배포 효과 · Batch 42

## 범위

이 글은 GPU를 배정받은 `img-job-91` Pod가 클러스터와 외부 시스템에 남길 수 있는 효과를 따라갑니다.

1. kubelet이 ServiceAccount의 짧은 projected token을 Pod에 넣습니다.
2. 같은 토큰으로 자기 Job 조회는 RBAC을 통과하고 Secret 조회는 거절됩니다.
3. 결과 업로드는 egress 정책이 허용하고 metadata IP 연결은 차단합니다.
4. 루트 파일시스템은 읽기 전용이고 `/work`만 5 GiB emptyDir로 엽니다.
5. 컨테이너 종료 뒤에도 같은 Pod가 남으면 emptyDir은 유지됩니다.
6. Pod가 실제로 삭제될 때 emptyDir이 정리되고 외부 결과는 별도 보존 정책을 따릅니다.

## 학습 지도

직속 부모 지도는 샌드박스 경계를 네 단계로 나눕니다.

`프로세스 → 시스템 호출 → GPU 장치 → 배포 통제`

이 글은 마지막 `배포 통제`를 맡습니다. 런타임 격리가 막지 못하는 API 권한·외부 통신·쓰기 흔적을 각각의 집행자와 수명에 연결해 부모 지도에 반환합니다.

## 공식 근거

- Kubernetes website의 `snapshot-initial-v1.37`에서 ServiceAccount·projected token·RBAC·NetworkPolicy·emptyDir·securityContext 의미를 고정했습니다.
- Kubernetes RBAC은 additive allow 규칙이며 인증 성공과 권한 허용이 다른 단계임을 확인했습니다.
- 표준 NetworkPolicy는 L3/L4 경계이며 FQDN 정책은 표준 기능으로 확대하지 않았습니다.
- Cilium `v1.20.4`에서 DNS proxy와 FQDN-to-IP 연결을 사용하는 확장 경로를 확인했습니다.
- emptyDir은 컨테이너 종료가 아니라 Pod 제거에 수명이 묶인다는 사실을 반영했습니다.

## 작성 원칙

- 정책 이름을 나열하지 않고 같은 Pod의 실제 요청·허용·거절·삭제 상태를 보여줍니다.
- token projection과 RBAC, 표준 NetworkPolicy와 Cilium FQDN 확장을 각각 분리합니다.
- YAML의 의미 있는 줄 앞에는 한글 주석을 둡니다.
- Job 완료·컨테이너 종료·Pod 삭제를 같은 사건으로 설명하지 않습니다.
- 장면은 명시적인 재생과 이동에만 반응합니다.
- JavaScript가 꺼져도 여섯 장면과 결론을 같은 순서로 읽을 수 있게 정적 본문을 생성합니다.

## 검증

- [x] TypeScript 검사와 문서 계약 검사
- [x] 390×844 모바일과 1440×1000 데스크톱
- [x] 첫 시각화가 첫 설명보다 먼저 나오는지 확인
- [x] 키보드 좌우 이동과 명시적 재생
- [x] reduced-motion에서 자동 진행 없음
- [x] 모든 장면의 가로 잘림과 설명·조작부 겹침 없음
- [x] 전체 production build 뒤 JavaScript 비활성 정적 본문 확인
- [ ] 공개 경로 배포 뒤 같은 검증 반복
