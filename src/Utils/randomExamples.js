const examples = [
  {
    scramble: "R2 U R U R' U' R' U' R' U R'",
    moveset: ['R', 'U'],
    depth: 13
  },
  {
    scramble: "L' U L U L' U2 L",
    moveset: ['R', 'U', 'L'],
    depth: 7
  },
  {
    scramble: "R' D R U2 R' D' R U2",
    moveset: ['R', 'U', 'D'],
    depth: 10
  },
  {
    scramble: "R E R' U' R E' R' U",
    moveset: ['R', 'U', 'E'],
    depth: 8
  }
];

function generateRandomExample() {
  const randomNum = Math.floor(Math.random() * examples.length);
  return examples[randomNum];
}

export default generateRandomExample;