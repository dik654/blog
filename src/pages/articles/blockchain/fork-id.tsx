import Overview from './fork-id/Overview';
import CRC32ENR from './fork-id/CRC32ENR';
import PowToPos from './fork-id/PowToPos';
import TestDesign from './fork-id/TestDesign';

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
