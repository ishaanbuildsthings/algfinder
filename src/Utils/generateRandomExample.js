/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
// these are random examples that can show when the random example button is clicked
// good examples are 12 move 3gen, 10 move 4gen, that don't have a lot of solutions
const examples = [
  // { // u perm
  //   scramble: "R2 U R U R' U' R' U' R' U R'",
  //   moveset: ['R', 'U'],
  //   depth: 13
  // },
  {
    // checkerboard oll
    scramble: "M U R U R' U' M2 U R U' r'",
    moveset: ['R', 'U', 'M'],
    depth: 12,
  },
  {
    // corner
    scramble: "R' D' R' D R U2 R' D' R U2 D R",
    moveset: ['R', 'U', 'D'],
    depth: 12,
  },
  {
    scramble: "r u2 r' u r2 u' r' u r' u2 r u r u r",
    moveset: ['r', 'u'],
    depth: 16,
  },
  // plus sign pattern
  {
    scramble: "U2 R2 L2 U2 R2 L2",
    moveset: ['R', 'L', 'U'],
    depth: 6,
  },
  // another pattern
  {
    scramble: "L R' U2 D2 L' R U2 D2 R2 L2",
    moveset: ['R', 'L', 'U', 'D'],
    depth: 8,
  },
  // bars
  {
    scramble: "R2 F2 L2 R2 F2 L2",
    moveset: ['R', 'L', 'F'],
    depth: 6,
  },
  {
    scramble: "f l f2 l' f' l' f' l2 f2 l f l f2 l' f l",
    moveset: ['f', 'l'],
    depth: 16,
  },
  {
    scramble: "d b d2 b d b' d2 b' d' b d' b2 d b' d2 b",
    moveset: ['d', 'b'],
    depth: 16,
  },
];

export default function generateRandomExample() {
  const randomNum = Math.floor(Math.random() * examples.length);
  return examples[randomNum];
}
