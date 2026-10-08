# NCA-AIIO 글 작성 원장

기준일: 2026-10-08

## 독자와 약속

- 독자: Kubernetes·컨테이너·GPU workload는 다뤘지만 GPU 서버, fabric, 전력·냉각과 cluster 운영 용어를 한 체계로 연결하지 못한 경력 지원자
- 글 유형: 자격증 소개가 아니라 시험 범위를 현장 학습과 면접 증거로 바꾸는 tutorial·study roadmap
- 한 문장 약속: NCA-AIIO가 확인하는 넓이, 확인하지 않는 깊이와 기존 AI 인프라 P0 여섯 글의 실습 순서를 구분한다.
- 제외: 기출 복원·dump, 합격 보장, 비공개 싱가포르 구축안, 실제 OEM BOM·시설 승인, NCP 수준의 배포 숙련 주장

## 먼저 답할 질문

- 질문: 엘리스 인프라 솔루션 엔지니어 지원 전에 NCA-AIIO를 따는 것이 유효한가?
- 답: 유효하다. AI·GPU·network·power/cooling·orchestration·monitoring의 빈칸을 빠르게 찾는 Associate 수준의 폭 점검으로 쓴다.
- 결정: 자격 준비와 별도로 호환성, scheduling, storage, facility, commissioning 실습 artifact를 남긴다. 자격 이름만 이력서의 구축 경험으로 표현하지 않는다.

## 공식 사실 원장

| 사실 | 공식 근거 | 적용 범위 |
|---|---|---|
| 시험은 50문항, 60분, 영어, 미화 125달러이며 원격 감독 방식이다. | NVIDIA NCA-AIIO 공식 페이지 | 2026-10-08 확인값. 접수 직전 다시 확인한다. |
| 유효기간은 발급일부터 2년이며 재응시는 갱신 방법으로 안내된다. | NVIDIA NCA-AIIO 공식 페이지 | 현재 자격 운영 정보에만 적용한다. |
| 공식 비중은 Essential AI Knowledge 38%, AI Infrastructure 40%, AI Operations 22%다. | NVIDIA NCA-AIIO 공식 페이지·2026년 1월 Study Guide | 학습 배분 기준이다. 실제 시험의 정확한 영역별 문항 수를 보장하지 않는다. |
| 대상은 AI 인프라·운영에 새로 들어오는 IT 전문가이며 technical pre-sales부터 data center operations까지 포함한다. | NVIDIA NCA-AIIO Study Guide | Associate 수준의 역할 경계다. |
| 역할은 전문 관리자와 협력해 AI data center 운영에 기여하는 수준으로 설명된다. | NVIDIA NCA-AIIO Study Guide | 독립적인 대규모 구축·최적화 능력의 증명으로 확대하지 않는다. |
| 공식 권장 self-paced 과정의 통상 학습 시간은 7시간이다. | NVIDIA NCA-AIIO 공식 페이지 | 전체 실무 준비 시간이 아니라 공식 과정 안내다. |

## 같은 사건을 따라가는 개요

1. S: GPU 16개가 보이는데 2-node collective job은 시작하지 못한다.
2. B: workload 요구→physical·software path→scheduler→monitor·recovery의 검은 상자를 연다.
3. 0: 50문항의 공식 비중을 19·20·11개짜리 연습 문제 장부로 바꾼다.
4. 1: 증상별로 어떤 책임 구간을 먼저 확인할지 고른다.
5. 2: 시험 합격과 현장 수행 증거를 분리한다.
6. 3: exam blueprint, evidence map, role boundary에 이름을 붙인다.
7. 4: 공식 목표→설명→실습→artifact→복습의 반복 절차를 만든다.
8. 5: 공식 Study Guide와 실제 inventory·topology·health 명령을 연결한다.
9. 6: 현행 시험 세 영역과 NCP-AII·NCP-AIO의 다음 경계를 비교한다.
10. 7: NCA-AIIO가 BOM·RFP·시설 승인·실전 구축을 대신하지 못하는 한계를 닫는다.

## 출처 원칙

- 시험명·비중·가격·문항·시간·유효기간은 NVIDIA의 현재 certification page와 2026년 1월 Study Guide만 사용한다.
- 제품·운영 명령은 NVIDIA 공식 문서와 각 프로젝트의 공식 문서를 사용한다.
- 블로그·영상은 용어 복습에만 쓰며 시험 운영 사실이나 호환성의 근거로 쓰지 않는다.
- 모든 숫자 사례는 `(가정)` 또는 `학습 장부`로 표시하고 실제 현장 계측값과 분리한다.
