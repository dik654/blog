import Overview from './xml-prompting/Overview';
import BasicTags from './xml-prompting/BasicTags';
import AdvancedTags from './xml-prompting/AdvancedTags';
import Parsing from './xml-prompting/Parsing';
import BestPractices from './xml-prompting/BestPractices';

export default function XmlPromptingArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <BasicTags />
      <AdvancedTags />
      <Parsing />
      <BestPractices />
    </div>
  );
}
