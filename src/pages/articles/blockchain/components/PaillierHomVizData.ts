// Simulated Paillier homomorphic addition (toy values for display)
export const N = 77; // toy n=7*11
export const G = 78; // n+1 simplified

export function modpow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

export function toyEncrypt(m: number, r: number): number {
  // c = g^m * r^n mod n^2 (simplified)
  const n2 = N * N;
  return (modpow(G, m, n2) * modpow(r, N, n2)) % n2;
}
