import Overview from './proofofsql/Overview';
import QueryProof from './proofofsql/QueryProof';
import DoryCommitment from './proofofsql/DoryCommitment';
import Verification from './proofofsql/Verification';
import Benchmark from './proofofsql/Benchmark';

export default function ProofOfSQLArticle() {
  return (
    <>
      <Overview />
      <QueryProof />
      <DoryCommitment />
      <Verification />
      <Benchmark />
    </>
  );
}
