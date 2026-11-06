/** 본문 3절의 가정한 두 표입니다. 행 번호가 단어 번호입니다. */
export const WORDS = ["</s>", "red", "cat", "saw", "dog"] as const;
export const W_TABLE = [[0, 0, 0], [1, 0, 0], [1, 2, 0], [0, 1, 1], [0, 0, 1]] as const;
export const U_TABLE = [[0, 0, 0], [1, 0, 1], [2, 0, 1], [0, 1, 2], [1, 1, 0]] as const;
