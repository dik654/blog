import Overview from './tokenizer/Overview';
import BPE from './tokenizer/BPE';
import WordPiece from './tokenizer/WordPiece';
import SentencePiece from './tokenizer/SentencePiece';
import Comparison from './tokenizer/Comparison';

export default function TokenizerArticle() {
  return (
    <>
      <Overview />
      <BPE />
      <WordPiece />
      <SentencePiece />
      <Comparison />
    </>
  );
}
