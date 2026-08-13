import Overview from "./rnn/Overview";
import LanguageModel from "./rnn/LanguageModel";
import Architecture from "./rnn/Architecture";
import BPTT from "./rnn/BPTT";

export default function RNNArticle() {
  return (
    <div className="[&_svg_text]:text-[11px]">
      <Overview />
      <Architecture />
      <LanguageModel />
      <BPTT />
    </div>
  );
}
