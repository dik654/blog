# AI 샌드박스 GPU 장치 경로 · Batch 41

## 범위

이 글은 앞 글의 이미지 생성 작업이 GPU 0을 배정받아 `/dev/nvidia0`을 여는 순간부터 시작합니다.

1. CUDA 프로세스가 GPU 장치 파일을 엽니다.
2. gVisor의 nvproxy는 지원하는 NVIDIA ioctl을 해석·검사해 호스트 드라이버로 전달합니다.
3. Kata passthrough는 GPU를 VFIO 장치로 분리해 VM에 연결하고 게스트 드라이버가 사용하게 합니다.
4. IOMMU는 장치가 DMA로 접근할 수 있는 메모리 범위를 제한합니다.
5. GPU·드라이버·런타임·VMM·IOMMU·리셋 결과를 한 조합의 근거로 남깁니다.

## 학습 지도

직속 부모 지도는 샌드박스 경계를 네 단계로 나눕니다.

`프로세스 → 시스템 호출 → GPU 장치 → 배포 통제`

이 글은 `GPU 장치`를 맡습니다. CPU 시스템 호출 격리를 GPU 격리로 확대하지 않고, nvproxy의 요청 중개와 VFIO의 장치 할당을 서로 다른 경로로 부모 지도에 반환합니다.

## 공식 근거

- gVisor `release-20261019.0` GPU 문서에서 nvproxy의 ioctl 중개 경계와 공식 지원 GPU·드라이버 범위를 확인했습니다.
- Linux kernel VFIO 문서에서 IOMMU 그룹, DMA 주소 변환과 장치 직접 할당의 커널 경계를 확인했습니다.
- Kata Containers `4.3.1` NVIDIA GPU passthrough 문서에서 Pod Resources API·CDI·VFIO BDF·QEMU cold-plug·게스트 드라이버 경로를 확인했습니다.
- gVisor의 고정된 지원 목록에 RTX A6000과 B300이 명시되어 있지 않음을 확인하고, 지원 가능성과 공식 지원을 구분했습니다.

## 작성 원칙

- 첫 설명보다 먼저 같은 GPU 0 요청의 두 장치 경로를 시각화합니다.
- nvproxy의 ioctl 중개와 VFIO passthrough를 같은 “GPU 지원”으로 묶지 않습니다.
- IOMMU가 장치 리셋·공유·NVLink·IOMMU 그룹 문제까지 해결한다고 확대하지 않습니다.
- 한 GPU 조합의 결과를 다른 모델·드라이버 조합의 측정값으로 쓰지 않습니다.
- 장면은 명시적인 재생과 이동에만 반응합니다.
- JavaScript가 꺼져도 다섯 장면과 결론을 같은 순서로 읽을 수 있게 정적 본문을 생성합니다.

## 검증

- [x] TypeScript 검사와 문서 계약 검사
- [x] 390×844 모바일과 1440×1000 데스크톱
- [x] 첫 시각화가 첫 설명보다 먼저 나오는지 확인
- [x] 키보드 좌우 이동과 명시적 재생
- [x] reduced-motion에서 자동 진행 없음
- [x] 모든 장면의 가로 잘림과 설명·조작부 겹침 없음
- [x] 전체 production build 뒤 JavaScript 비활성 정적 본문 확인
- [ ] 공개 경로 배포 뒤 같은 검증 반복
