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
    title: "ElGamal 암호",
    subcategory: "classical",
    sections: [
      { id: "overview", title: "ElGamal이란?" },
      { id: "encrypt-decrypt", title: "암호화와 복호화" },
      { id: "security", title: "안전성과 응용" },
    ],
    component: () => import("@/pages/articles/crypto/elgamal"),
  },
];
