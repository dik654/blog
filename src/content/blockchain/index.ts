import type { Category } from '../types';
import { subcategories } from './subcategories';
import { ethereumArticles } from './articlesEthereum';
import { ethereum2Articles } from './articlesEthereum2';
import { ethereum3Articles } from './articlesEthereum3';
import { cosmosArticles } from './articlesCosmos';
import { fundamentalsArticles, bftArticles } from './articlesFundBft';
import { bftNewArticles } from './articlesBftNew';
import { filecoinArticles } from './articlesFilecoin';
import { filecoin2Articles } from './articlesFilecoin2';
import { filecoin3Articles } from './articlesFilecoin3';
import { l1Articles } from './articlesL1';
import { polkadotArticles } from './articlesPolkadot';
import { prysmArticles } from './articlesPrysm';
import { commonwareArticles } from './articlesCommonware';
import { zkFromScratchArticles } from './articlesZkFromScratch';

const blockchain: Category = {
  slug: 'blockchain',
  name: 'Blockchain',
  description: '블록체인, 이더리움, 코스모스, 합의 알고리즘 학습 노트',
  subcategories,
  articles: [
    ...fundamentalsArticles,
    ...ethereumArticles,
    ...ethereum2Articles,
    ...ethereum3Articles,
    ...cosmosArticles,
    ...bftArticles,
    ...bftNewArticles,
    ...filecoinArticles,
    ...filecoin2Articles,
    ...filecoin3Articles,
    ...l1Articles,
    ...polkadotArticles,
    ...prysmArticles,
    ...commonwareArticles,
    ...zkFromScratchArticles,
  ],
};

export default blockchain;
