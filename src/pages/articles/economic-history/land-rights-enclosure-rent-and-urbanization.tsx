import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { landRightsRentUrbanizationData } from "./economic-history-thematic-data";
import HouseholdShareSplitViz from "./land-rights-enclosure-rent-and-urbanization/viz/HouseholdShareSplitViz";
import RicardoRentLadderViz from "./land-rights-enclosure-rent-and-urbanization/viz/RicardoRentLadderViz";

const data = {
  ...landRightsRentUrbanizationData,
  figures: {
    case: { 1: <HouseholdShareSplitViz /> },
    names: { 2: <RicardoRentLadderViz /> },
  },
};

export default function LandRightsEnclosureRentAndUrbanizationArticle() {
  return <WorldHistoryArticle data={data} />;
}
