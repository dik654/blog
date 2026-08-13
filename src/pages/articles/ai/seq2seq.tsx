import Overview from "./seq2seq/Overview";
import Encoder from "./seq2seq/Encoder";
import Decoder from "./seq2seq/Decoder";
import Training from "./seq2seq/Training";
import Limitations from "./seq2seq/Limitations";

export default function Seq2SeqArticle() {
  return (
    <>
      <Overview />
      <Encoder />
      <Decoder />
      <Training />
      <Limitations />
    </>
  );
}
