import type { Article } from '../types';
import { dlArticles } from './articlesDL';
import { llmArticles } from './articlesLLM';
import { tsArticles } from './articlesTS';
import { genArticles } from './articlesGen';
import { agentArticles } from './articlesAgent';
import { agentOpsArticles } from './articlesAgentOps';
import { fromScratchArticles } from './articlesFromScratch';
import { clawCodeArticles } from './articlesClawCode';
import { practicalArticles } from './articlesPractical';

export const aiArticles: Article[] = [
  ...dlArticles,
  ...llmArticles,
  ...tsArticles,
  ...genArticles,
  ...agentArticles,
  ...agentOpsArticles,
  ...clawCodeArticles,
  ...fromScratchArticles,
  ...practicalArticles,
];
