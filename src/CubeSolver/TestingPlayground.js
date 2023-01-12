// used during development to test the cube and solving algorithm
// need to add "type": "module", to package.json

// todo
import applyAlg from './AlgHandler.js';
import Cube from './Cube.js';
import readline from 'readline-sync';
import { visualize } from './Visualizer.js';

const myCube = new Cube();
const myStr = "F r' z F2 U l2 L S d' E U' x S y l2 l2 r' z2 r2 L2 x2 l R2 b' E2 y F2 b' r2 L f2 l2 d2 y x L' B L2 U z2 R E y' u2 B' D M2 y2 M' R l L M2 E2 l' r' B f' L x' L' R2 z2 y U y f' S2 E2 R' F2 U S M' x2 U B' M d S z L' b2 d2 U' z F2 x' r2 r U U d2 l S' l z' E F F z2 L M' D D2 r' f' z' S' u f' y' r2 D' r' d M R' L f M' S U2 b' D y2 x' y' F r2 E' E2 E d2 U2 S2 f2 D' E' b2 d2 r' z y d E' d2 x' f2 E U' b b' M' f S' d' d' y' S2 U' F' B b z' z' B' S' u2 d E' F' y2 l d y E S2 M2 B' f x2 z2 x' U2 M2 L' L' r' z2 r2 x D2 b2 S2 b y D2 r2 f2 x2 z2 L f L' d' E' l2 B E B' f R' r2 x2 r' E' U L' z2 l2 L' l2 f F2 R' L L' U' x b' r' M2 b U y2 r' x' S' d2 z2 u' R E' z2 U2 S2 f D y' R' d u2 S2 S2 y' y2 R2 d2 l y y2 M r' y' S l z b' y' L y2 F' y R' M b u' z' b L' U2 B2 F' b L2 z' U2 z y2 L' y u d2 D' x' U2 L' x' y2 S2 E y z' u2 D2 d' S' x' r2 S' y' R2 u' r' f' z z l d D2 B' u' l2 S' l2 E r x u2 L' R L y' r L2 D l' f' b' M2 d' E2 U2 u B2 b' R M f f y2 z' L' d' x d2 M2 f' F2 d' F' E2 S2 R2 R' y x2 y M D' S2 z u2 F2 E F2 L S2 z' d d L b' l2 L' L z' f F F2 b2 M' u' x S2 M' r2 l d l u2 F2 x B r2 S' d2 U R D2 U' l' F' M b2 l' D B D2 U' l' R y' S2 u' r' y2 U2 f' f' D b u r' z' B2 y L M2 E2 R2 d' d' x b' f S' F2 f u' B f' y' L d z l S2 u2 B f F2 b x' r M2 x' F' R2 S' L2 y D2 D2 L2 r E' x S2 d2 y2 E f L x2 R2 u2 y2 y r r' D' z l' D2 B E' b R";
applyAlg(myStr.split(' '), myCube);
visualize(myCube);
while (true) {
const move = readline.question('next move?');
applyAlg([move], myCube);
visualize(myCube);
}