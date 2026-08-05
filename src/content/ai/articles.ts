import type { Article } from '../types';
import { dlArticles } from './articlesDL';
import { llmArticles } from './articlesLLM';
import { llmArchitectureArticles } from './articlesLLMArchitectures';
import { tsArticles } from './articlesTS';
import { genArticles } from './articlesGen';
import { openModelArticles } from './articlesOpenModels';
import { ocrArticles } from './articlesOCR';
import { agentArticles } from './articlesAgent';
import { agentOpsArticles } from './articlesAgentOps';
import { fromScratchArticles } from './articlesFromScratch';
import { clawCodeArticles } from './articlesClawCode';
import { practicalArticles } from './articlesPractical';
import { systemsFoundationArticles } from './articlesSystemsFoundation';
import { mathFoundationArticles } from './articlesMathFoundations';
import { reinforcementLearningArticles } from './articlesReinforcementLearning';
import { currentFlowArticles } from './articlesCurrentFlows';
import { multimodalArticles } from './articlesMultimodal';

export const aiArticles: Article[] = [
  ...systemsFoundationArticles,
  ...dlArticles,
  ...mathFoundationArticles,
  ...reinforcementLearningArticles,
  ...currentFlowArticles,
  ...llmArticles,
  ...llmArchitectureArticles,
  ...multimodalArticles,
  ...tsArticles,
  ...genArticles,
  ...openModelArticles,
  ...ocrArticles,
  ...agentArticles,
  ...agentOpsArticles,
  ...clawCodeArticles,
  ...fromScratchArticles,
  ...practicalArticles,
];
