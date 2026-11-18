import CandidateNarrowingViz from "./reference-context-and-speech-acts/viz/CandidateNarrowingViz";
import FelicityBranchViz from "./reference-context-and-speech-acts/viz/FelicityBranchViz";
import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import { languageData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...languageData,
  figures: {
    mechanism: { 0: <CandidateNarrowingViz /> },
    comparison: { 1: <FelicityBranchViz /> },
  },
};

export default function ReferenceContextAndSpeechActsArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
