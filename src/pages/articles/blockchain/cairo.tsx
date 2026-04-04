import Overview from './cairo/Overview';
import Sierra from './cairo/Sierra';
import CASM from './cairo/CASM';
import Starknet from './cairo/Starknet';
import Stwo from './cairo/Stwo';
import Memory from './cairo/Memory';

export default function CairoArticle() {
  return (
    <>
      <Overview />
      <Sierra />
      <CASM />
      <Starknet />
      <Stwo />
      <Memory />
    </>
  );
}
