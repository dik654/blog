import KZG from './plonk/KZG';
import PLONKish from './plonk/PLONKish';
import Plookup from './plonk/Plookup';
import ProverVerifier from './plonk/ProverVerifier';
import FFLONK from './plonk/FFLONK';

export default function Plonk() {
  return (
    <>
      <KZG />
      <PLONKish />
      <Plookup />
      <ProverVerifier />
      <FFLONK />
    </>
  );
}
