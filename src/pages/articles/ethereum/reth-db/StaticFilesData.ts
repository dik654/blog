export const STATIC_FILE_STEPS = [
  {
    title: "segment availability 확인",
    desc: "요청한 data kind와 block range가 local static-file segments에 존재하는지 확인한다.",
  },
  {
    title: "segment와 index metadata 선택",
    desc: "파일명 산술만 가정하지 않고 provider가 관리하는 segment headers와 index를 사용한다.",
  },
  {
    title: "record decode와 integrity 검사",
    desc: "compression·dictionary·checksum 같은 실제 segment format에 맞춰 값을 복원한다.",
  },
  {
    title: "pruned와 missing을 구분",
    desc: "보존 정책상 없는 데이터인지 local artifact가 손상되거나 불완전한지 caller가 구분할 수 있게 한다.",
  },
] as const;
