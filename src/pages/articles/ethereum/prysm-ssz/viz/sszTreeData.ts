/**
 * 본문 대응: #merkleize · #multiproof — DemoRecord {slot: 1, validators: [10, 20], epoch: 3}의 Merkle node.
 * SHA-256으로 직접 다시 계산했다. 본문 값: validators root 9647…c266, 최종 root 9dfd…32cc.
 * 중간 node 2 = H(4‖5) = 695f…1d4f, 3 = H(6‖7) = e7b4…e416 은 같은 계산의 중간값이다.
 * 가정 장면용: 같은 data chunk에 길이 3을 섞으면 H(c_v‖ℓ₃) = 415b…3ba5.
 */
export type NodeTone = "base" | "active" | "sibling" | "target" | "missing" | "dim";

export type TreeNodeId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "cv" | "len";

export const TREE_VALUES: Readonly<Record<TreeNodeId, string>> = {
  "1": "9dfd…32cc",
  "2": "695f…1d4f",
  "3": "e7b4…e416",
  "4": "01…00",
  "5": "9647…c266",
  "6": "03…00",
  "7": "00…00",
  cv: "0a…14…00",
  len: "02…00",
};

export const TREE_NAMES: Readonly<Record<TreeNodeId, string>> = {
  "1": "root",
  "2": "H(4‖5)",
  "3": "H(6‖7)",
  "4": "slot",
  "5": "validators",
  "6": "epoch",
  "7": "zero leaf",
  cv: "data chunk",
  len: "length",
};

export const LIST_ROOT_LENGTH_3 = "415b…3ba5";
