/**
 * 본문 대응: #lde-fri, #source — 같은 상태 다항식 v(T)=8T²+14T+1을 T=0…7에서 17로 나눈 나머지로 계산합니다.
 * 평가점 0…7은 글의 "8개의 점"을 그리려고 고른 가정입니다.
 * v: 1, 6, 10, 13, 15, 16, 16, 15   (v(3)=115≡13은 8절 본문 값)
 * Z(T)=T(T−1)(T−2): 0, 0, 0, 6, 7, 9, 1, 6
 * v+Z·1: 1, 6, 10, 2, 5, 8, 0, 4   (T=3에서 13+6=19≡2는 9절 본문 값)
 */
export const MOD = 17;
export const TS: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7];
const mod = (x: number) => ((x % MOD) + MOD) % MOD;
export const V: readonly number[] = TS.map((t) => mod(8 * t * t + 14 * t + 1));
export const Z: readonly number[] = TS.map((t) => mod(t * (t - 1) * (t - 2)));
export const MASKED: readonly number[] = V.map((v, i) => mod(v + Z[i]));
