import type { Article } from "../types";

export const classicalArticles: Article[] = [
  {
    slug: "diffie-hellman",
    title: "Diffie–Hellman: 인증·KDF·forward secrecy",
    subcategory: "classical",
    sections: [
      { id: "overview", title: "Raw key agreement의 경계" },
      { id: "protocol", title: "Public values와 shared output" },
      { id: "security", title: "인증·KDF·lifecycle·release" },
    ],
    component: () => import("@/pages/articles/crypto/diffie-hellman"),
  },
  {
    slug: "elgamal",
    title: "ElGamal: fresh DH mask·IND-CPA와 malleability 경계",
    subcategory: "classical",
    sections: [
      { id: "overview", title: "Fresh DH mask의 입구" },
      { id: "encrypt-decrypt", title: "암호화·복호화와 수치 예제" },
      { id: "security", title: "DDH·IND-CPA와 malleability" },
      { id: "release", title: "Hybrid encryption release gate" },
    ],
    component: () => import("@/pages/articles/crypto/elgamal"),
  },
];
