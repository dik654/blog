export const DATASET_LINEAGE = [
  { id: "clip-042", type: "원본 영상", detail: "person-C · group 042-C" },
  { id: "swap-042-Z", type: "조작 영상", detail: "generator-Z · recipe z7" },
  { id: "social-042-Z.mp4", type: "재인코딩", detail: "social codec · 256 px" },
  { id: "frame-120", type: "프레임", detail: "00:04 · source frame 120" },
  { id: "crop-04-a1", type: "모델 입력", detail: "track A · crop revision c3" },
] as const;

export const PERMISSION_RECEIPT = {
  personId: "person-C",
  revision: "permission-C-r3",
  allowed: "촬영·얼굴 변형·학습·평가",
  notCovered: "공개 재배포",
} as const;

export interface CoverageCell {
  generator: "generator-X" | "generator-Y" | "generator-Z";
  codec: "원본" | "JPEG q70" | "social codec";
  files: number;
  groups: number;
}

export const COVERAGE_CELLS: readonly CoverageCell[] = [
  { generator: "generator-X", codec: "원본", files: 240, groups: 40 },
  { generator: "generator-X", codec: "JPEG q70", files: 228, groups: 38 },
  { generator: "generator-X", codec: "social codec", files: 204, groups: 34 },
  { generator: "generator-Y", codec: "원본", files: 132, groups: 22 },
  { generator: "generator-Y", codec: "JPEG q70", files: 120, groups: 20 },
  { generator: "generator-Y", codec: "social codec", files: 0, groups: 0 },
  { generator: "generator-Z", codec: "원본", files: 72, groups: 12 },
  { generator: "generator-Z", codec: "JPEG q70", files: 66, groups: 11 },
  { generator: "generator-Z", codec: "social codec", files: 60, groups: 10 },
] as const;

export const GROUP_042_SOCIAL_FILES = [
  "crop-00-a1",
  "crop-01-a1",
  "crop-03-a1",
  "crop-04-a1",
  "crop-06-a1",
  "crop-09-a1",
] as const;

export const RELEASE_TRACE = {
  datasetBefore: "dataset-d08",
  datasetAfter: "dataset-d09",
  permissionBefore: "permission-C-r3 · 사용 가능",
  permissionAfter: "permission-C-r4 · 새 release 사용 중지",
  supportBefore: 10,
  supportAfter: 9,
  minimumSupport: 10,
  claimBefore: "generator-Z · social codec 결과 공개",
  claimAfter: "해당 조건의 수치 주장 제외",
} as const;
