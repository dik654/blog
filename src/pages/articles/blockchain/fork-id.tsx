import Overview from '../ethereum/fork-id/Overview';
import CRC32ENR from '../ethereum/fork-id/CRC32ENR';
import PowToPos from '../ethereum/fork-id/PowToPos';
import TestDesign from '../ethereum/fork-id/TestDesign';

export default function ForkId() {
  return (
    <>
      <Overview />
      <CRC32ENR />
      <PowToPos />
      <TestDesign />
    </>
  );
}
