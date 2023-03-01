// these are random examples that can show when the random example button is clicked
// good examples are 12 move 3gen, 10 move 4gen, that don't have a lot of solutions
const examples = [
  // { // u perm
  //   scramble: "R2 U R U R' U' R' U' R' U R'",
  //   moveset: ['R', 'U'],
  //   depth: 13
  // },
  { // a perm
    scramble: "x R' U R' D2 R U' R' D2 R2",
    moveset: ['R', 'U', 'D', 'x'],
    depth: 10
  },
  { // j perm
    scramble: "R' U L' U2 R U' R' U2 R L",
    moveset: ['R', 'U', 'L'],
    depth: 12
  },
  { // checkerboard oll
    scramble: "M U R U R' U' M2 U R U' r'",
    moveset: ['R', 'U', 'M'],
    depth: 12
  },
  { // corner
    scramble: "R' D' R' D R U2 R' D' R U2 D R",
    moveset: ['R', 'U', 'D'],
    depth: 12
  }
];

export default function generateRandomExample() {
  const randomNum = Math.floor(Math.random() * examples.length);
  return examples[randomNum];
};