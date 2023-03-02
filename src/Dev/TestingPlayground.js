// * this is for testing in node

// used during development to test the cube and solving algorithm
// need to add "type": "module", to package.json

// eslint-disable-next-line import/no-extraneous-dependencies
import readline from 'readline-sync';
import { applyAlg } from './algHandler.js';
import Cube from './cube.js';
import { visualize } from './visualizer.js';

const myCube = new Cube();
const myStr =
  "L z' S' R2 U U2 f2 B' U2 d S' d2 z E2 d' U2 y' L d2 R S2 r2 d2 d2 R2 r' L L2 B' S' L l2 l2 F' y2 M2 r l2 x u2 F' S B2 D u2 y2 x l' M' D b y f' M2 l f' u2 L' l2 r' E' x' E y2 u' S2 D' M2 F2 B b' E' S2 R' u L S2 L' f2 l2 B' d' u U x E2 u b2 E' d' z' x' x2 x' E D' S f r' F' E F2 b M' E x' y2 E E' f2 S' d' y' M b B2 L U F' f2 b u2 R' E x' l' x' y2 x' y U' F y2 U R2 R M z' y' B' R2 d S' R f U d r L' d' D x S' r2 x' b2 E' u x' U f' S F2 F S2 S2 r' x2 L f L2 l' f' B' L E2 z b' D y' F l2 b' b2 L B y E f' D y2 z B2 b D2 B R S M' r2 l' M d d l2 z2 f b L' E B' d' R r S' f y' D l2 l2 E' z2 B' x' F' l' M x L' r' S' L2 y' f' B b2 l2 r' l D' z u' y' D u' l2 b2 S2 B R E' D' r' R' r' B2 l f2 D F u2 b' L U' u' B z' x f R L2 z' f' l2 U' u d2 z' E2 l' U r2 z2 l D2 U2 U2 M2 R' u S' z2 L' f' y d L' R2 b M' d' B' z2 E2 z' u y' d R2 b R2 d' b' R2 z2 l2 x u' u' L' y' d u' F2 B D2 R2 R' b2 D x u f2 u2 E2 U' F z2 E' u' f2 S' B x' f2 f2 D' L2 S2 l' D' B' x B' F R d2 d2 F2 z' L' S U' d x2 r x2 R U' F2 z' U2 l r E S2 L' L E2 y L E S' f l' b x z2 D' E' U' F' d M' F r' B' r' U l' b z2 u2 f2 y2 U' l2 u R R L L2 E L' d D' U u' R f' U2 D2 D2 d2 l' y' y' S z2 f l' E2 f2 u2 r x2 u' f' S' d u2 z' d' f z B D E z2 b r2 E2 E u E' x2 L R2 b2 y2 z2 B2 S F f2 l2 M2 r2 B u2 f l2 b' S2 y2 L2 M2 M' x2 l S R2 r' b2 U B2 d2 l' U' E' d2 z y' M d' M2 d' u2 z y";
applyAlg(myStr.split(' '), myCube);
visualize(myCube);
// eslint-disable-next-line no-constant-condition
while (true) {
  const move = readline.question('next move?');
  applyAlg([move], myCube);
  visualize(myCube);
}
