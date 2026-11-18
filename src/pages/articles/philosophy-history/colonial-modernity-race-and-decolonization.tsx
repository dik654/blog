import PhilosophyHistoryArticle from "./PhilosophyHistoryArticle";
import SelectionLoopViz from "./colonial-modernity-race-and-decolonization/viz/SelectionLoopViz";
import { colonialModernityData } from "./philosophy-history-data";

export default function ColonialModernityRaceAndDecolonization() {
  return <PhilosophyHistoryArticle data={{ ...colonialModernityData, figures: { mechanism: { 0: <SelectionLoopViz /> } } }} />;
}
