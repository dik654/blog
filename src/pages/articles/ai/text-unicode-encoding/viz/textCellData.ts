import type { RulerItem } from "./TextCells";

/** 본문 3·4·6·11절의 세 표현. byte 값은 14절과 표의 값이며 NFD의 두 자모는 U+1100, U+1161의 UTF-8입니다. */
export const RAW_ITEMS: readonly RulerItem[] = [
  { glyph: "A", cluster: 0, bytes: ["41"], u16: 1 },
  { glyph: "e", cluster: 1, bytes: ["65"], u16: 1 },
  { glyph: "◌́", cluster: 1, bytes: ["CC", "81"], u16: 1 },
  { glyph: "가", cluster: 2, bytes: ["EA", "B0", "80"], u16: 1 },
  { glyph: "😀", cluster: 3, bytes: ["F0", "9F", "98", "80"], u16: 2 },
];

export const NFC_ITEMS: readonly RulerItem[] = [
  { glyph: "A", cluster: 0, bytes: ["41"], u16: 1 },
  { glyph: "é", cluster: 1, bytes: ["C3", "A9"], u16: 1 },
  { glyph: "가", cluster: 2, bytes: ["EA", "B0", "80"], u16: 1 },
  { glyph: "😀", cluster: 3, bytes: ["F0", "9F", "98", "80"], u16: 2 },
];

export const NFD_ITEMS: readonly RulerItem[] = [
  { glyph: "A", cluster: 0, bytes: ["41"], u16: 1 },
  { glyph: "e", cluster: 1, bytes: ["65"], u16: 1 },
  { glyph: "◌́", cluster: 1, bytes: ["CC", "81"], u16: 1 },
  { glyph: "ᄀ", cluster: 2, bytes: ["E1", "84", "80"], u16: 1 },
  { glyph: "ᅡ", cluster: 2, bytes: ["E1", "85", "A1"], u16: 1 },
  { glyph: "😀", cluster: 3, bytes: ["F0", "9F", "98", "80"], u16: 2 },
];
