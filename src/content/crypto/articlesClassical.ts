import type { Article } from '../types';

export const classicalArticles: Article[] = [
  {
    slug: 'diffie-hellman',
    title: 'Diffie-Hellman 키 교환',
    subcategory: 'classical',
    sections: [
      { id: 'overview', title: '키 교환 문제' },
      { id: 'protocol', title: '프로토콜 흐름' },
      { id: 'security', title: '안전성과 한계' },
    ],
    component: () => import('@/pages/articles/crypto/diffie-hellman'),
  },
  {
    slug: 'elgamal',
    title: 'ElGamal 암호',
    subcategory: 'classical',
    sections: [
      { id: 'overview', title: 'ElGamal이란?' },
      { id: 'encrypt-decrypt', title: '암호화와 복호화' },
      { id: 'security', title: '안전성과 응용' },
    ],
    component: () => import('@/pages/articles/crypto/elgamal'),
  },
];
