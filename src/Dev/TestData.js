const cube1 = [
  [
    '🟦', '🟧', '🟩',
    '🟥', '⬜', '🟧',
    '🟩', '🟧', '⬜'
  ],
  [
    '🟥', '🟨', '🟥',
    '🟩', '🟦', '🟧',
    '🟥', '⬜', '🟨'
  ],
  [
    '⬜', '🟧', '🟩',
    '⬜', '🟧', '🟥',
    '🟩', '⬜', '🟧'
  ],
  [
    '⬜', '🟨', '⬜',
    '🟥', '🟨', '⬜',
    '🟦', '🟦', '🟧'
  ],
  [
    '⬜', '⬜', '🟦',
    '🟩', '🟥', '🟧',
    '⬜', '🟨', '🟩'
  ],
  [
    '🟧', '🟧', '🟦',
    '🟩', '🟩', '🟩',
    '🟨', '🟨', '🟥'
  ]
];

const cube2 = [
  [
    '🟩', '🟨', '🟨',
    '🟧', '🟦', '🟧',
    '🟧', '🟥', '🟨'
  ],
  [
    '🟥', '🟦', '⬜',
    '🟩', '🟥', '🟧',
    '🟧', '🟥', '🟩'
  ],
  [
    '🟦', '🟧', '🟧',
    '🟨', '🟨', '🟦',
    '🟦', '⬜', '🟨'
  ],
  [
    '🟩', '🟥', '⬜',
    '🟨', '🟩', '🟧',
    '🟩', '🟨', '🟦'
  ],
  [
    '🟧', '🟨', '🟧',
    '🟦', '⬜', '🟦',
    '🟨', '🟧', '⬜'
  ],
  [
    '🟨', '🟧', '🟦',
    '⬜', '🟧', '🟦',
    '🟦', '🟨', '🟩'
  ]
];

const cube3 = [
  [
    '🟩', '🟩', '🟨',
    '🟦', '🟨', '🟦',
    '🟦', '🟨', '🟧'
  ],
  [
    '⬜', '🟨', '🟦',
    '🟩', '🟩', '🟩',
    '🟦', '🟨', '🟨'
  ],
  [
    '🟥', '🟨', '⬜',
    '🟥', '🟧', '🟦',
    '🟨', '🟧', '🟥'
  ],
  [
    '⬜', '🟩', '🟨',
    '⬜', '⬜', '🟧',
    '🟧', '🟩', '⬜'
  ],
  [
    '🟨', '🟧', '⬜',
    '🟥', '🟥', '🟨',
    '🟥', '🟩', '⬜'
  ],
  [
    '🟧', '⬜', '🟥',
    '🟧', '🟦', '🟧',
    '🟥', '🟥', '🟦'
  ]
];


const colors = ['🟨', '🟧', '🟦', '⬜', '🟩', '🟥'];

function generateMatrix() {
  const matrix = [];

  for (let i = 0; i < 6; i++) {
    const sublist = [];

    const remainingColors = colors.filter(c => matrix.flat().filter(x => x === c).length < 9);
    const middleColor = remainingColors[Math.floor(Math.random() * remainingColors.length)];

    for (let j = 0; j < 3; j++) {
      const remainingColors = colors.filter(c => sublist.filter(x => x === c).length < 3);
      const color = remainingColors[Math.floor(Math.random() * remainingColors.length)];
      sublist.push(color);
    }

    sublist.push(middleColor);

    for (let j = 4; j < 9; j++) {
      const remainingColors = colors.filter(c => sublist.filter(x => x === c).length < 3);
      const color = remainingColors[Math.floor(Math.random() * remainingColors.length)];
      sublist.push(color);
    }
    matrix.push(sublist);
  }

  return matrix;
}

console.log(generateMatrix())