import type { Article } from '../types';
import { dlArticles } from './articlesDL';
import { llmArticles } from './articlesLLM';
import { tsArticles } from './articlesTS';
import { genArticles } from './articlesGen';
import { agentArticles } from './articlesAgent';
import { fromScratchArticles } from './articlesFromScratch';
import { clawCodeArticles } from './articlesClawCode';

export const aiArticles: Article[] = [
  ...dlArticles,
  ...llmArticles,
  ...tsArticles,
  ...genArticles,
  ...agentArticles,
  ...clawCodeArticles,
  ...fromScratchArticles,
];
