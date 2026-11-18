/**
 * 본문 대응: #case, #picture, #source — 2를 k번 곱한 뒤 23으로 나눈 나머지. k=0…10에서 11개 값이 한 번씩 나오고 2¹¹≡1로 되돌아옵니다.
 * POW[k] = 2^k mod 23: 1, 2, 4, 8, 16, 9, 18, 13, 3, 6, 12
 */
export const P = 23;
export const Q = 11;
export const POW: readonly number[] = Array.from({ length: Q }, (_, k) => 2 ** k % P);
