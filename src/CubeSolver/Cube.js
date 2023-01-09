import { simplifyMove } from './AlgHandler.js';

const SOLVED_STICKER_STATE = [
  '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜',
  '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩',
  '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥',
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦',
  '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧',
  '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨',
]

// todo
// const SOLVED_STICKER_STATE = [
//   'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w',
//   'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g',
//   'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r',
//   'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b',
//   'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
//   'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y',
// ]

const MOVES = [
  'U', 'R', 'F', 'B', 'L', 'D',
  'u', 'r', 'f', 'b', 'l', 'd',
  'S', 'E', 'M', 'x', 'y', 'z'
];

export default class Cube {
  constructor() {
    this.movesApplied = [];
    this.parentCube = null;
    this.depth = 0;
    this.allowedMoves = [];

    this.uFace = SOLVED_STICKER_STATE.slice(0, 9);
    this.fFace = SOLVED_STICKER_STATE.slice(9, 18);
    this.rFace = SOLVED_STICKER_STATE.slice(18, 27);
    this.bFace = SOLVED_STICKER_STATE.slice(27, 36);
    this.lFace = SOLVED_STICKER_STATE.slice(36, 45);
    this.dFace = SOLVED_STICKER_STATE.slice(45, 54);

    // to allow moving the right faces based on the letter passed to move function
    this.faceMapping = {
      'U': this.uFace, 'F': this.fFace, 'R': this.rFace,
      'D': this.dFace, 'L': this.lFace, 'B': this.bFace
    }
  }

  clone() {
    const clone = new Cube();
    clone.movesApplied = [...this.movesApplied];
    clone.uFace = [...this.uFace];
    clone.fFace = [...this.fFace];
    clone.rFace = [...this.rFace];
    clone.bFace = [...this.bFace];
    clone.lFace = [...this.lFace];
    clone.dFace = [...this.dFace];
    clone.faceMapping = {
      'U': clone.uFace, 'F': clone.fFace, 'R': clone.rFace,
      'D': clone.dFace, 'L': clone.lFace, 'B': clone.bFace
    };
    return clone;
  }

  // returns string representation of state
  getState() {
    let state = '';
    for (let key in this.faceMapping) {
      const face = this.faceMapping[key];
      for (let sticker of face) {
        state += sticker;
      }
    }
    return state;
  }

  move(move) {
    const lastChar = move[move.length - 1];
    const [u, f, r, d, l, b] = [this.uFace, this.fFace, this.rFace, this.dFace, this.lFace, this.bFace];

    if (move[0] === 'U')
    {
      const tempf = f.slice(0, 3);
      const tempr = r.slice(0, 3);
      const tempb = b.slice(0, 3);
      const templ = l.slice(0, 3);
      if (move === 'U') {
        l.splice(0, 3, ...tempf);
        b.splice(0, 3, ...templ);
        r.splice(0, 3, ...tempb);
        f.splice(0, 3, ...tempr);
      } else if (lastChar === "'") {
        l.splice(0, 3, ...tempb);
        b.splice(0, 3, ...tempr);
        r.splice(0, 3, ...tempf);
        f.splice(0, 3, ...templ);
      } else {
        l.splice(0, 3, ...tempr);
        b.splice(0, 3, ...tempf);
        r.splice(0, 3, ...templ);
        f.splice(0, 3, ...tempb);
      }
    }

    else if (move[0] === 'R')
    {
      const tempu = [u[2], u[5], u[8]];
      const tempb = [b[0], b[3], b[6]];
      const tempd = [d[2], d[5], d[8]];
      const tempf = [f[2], f[5], f[8]];
      if (move === 'R') {
        [b[0], b[3], b[6]] = tempu.reverse();
        [d[2], d[5], d[8]] = tempb.reverse();
        [f[2], f[5], f[8]] = tempd;
        [u[2], u[5], u[8]] = tempf;
      } else if (lastChar === "'") {
        [b[0], b[3], b[6]] = tempd.reverse();
        [d[2], d[5], d[8]] = tempf;
        [f[2], f[5], f[8]] = tempu;
        [u[2], u[5], u[8]] = tempb.reverse();
      } else {
        [b[0], b[3], b[6]] = tempf.reverse();
        [d[2], d[5], d[8]] = tempu;
        [f[2], f[5], f[8]] = tempb.reverse();
        [u[2], u[5], u[8]] = tempd;
      }
    }

    else if (move[0] === 'F')
    {
      const tempu = u.slice(6);
      const tempr = [r[0], r[3], r[6]];
      const tempd = d.slice(0, 3).reverse();
      const templ = [l[8], l[5], l[2]];
      if (move === 'F') {
        u.splice(6, 3, ...templ);
        [r[0], r[3], r[6]] = tempu;
        d.splice(0, 3, ...tempr.reverse());
        [l[8], l[5], l[2]] = tempd;
      } else if (lastChar === "'") {
        u.splice(6, 3, ...tempr);
        [r[0], r[3], r[6]] = tempd;
        d.splice(0, 3, ...templ.reverse());
        [l[2], l[5], l[8]] = tempu.reverse();
      } else {
        u.splice(6, 3, ...tempd);
        [r[0], r[3], r[6]] = templ;
        d.splice(0, 3, ...tempu.reverse());
        [l[8], l[5], l[2]] = tempr;
      }
    }

    else if (move[0] === 'D')
    {
      const tempf = f.slice(6);
      const tempr = r.slice(6);
      const tempb = b.slice(6);
      const templ = l.slice(6);
      if (move === 'D') {
        f.splice(6, 3, ...templ);
        l.splice(6, 3, ...tempb);
        b.splice(6, 3, ...tempr);
        r.splice(6, 3, ...tempf);
      } else if (lastChar === "'") {
        f.splice(6, 3, ...tempr);
        l.splice(6, 3, ...tempf);
        b.splice(6, 3, ...templ);
        r.splice(6, 3, ...tempb);
      } else {
        f.splice(6, 3, ...tempb);
        r.splice(6, 3, ...templ);
        b.splice(6, 3, ...tempf);
        l.splice(6, 3, ...tempr);
      }
    }

    else if (move[0] === 'L')
    {
      const tempu = [u[0], u[3], u[6]];
      const tempf = [f[0], f[3], f[6]];
      const tempd = [d[0], d[3], d[6]];
      const tempb = [b[8], b[5], b[2]];
      if (move === 'L') {
        [u[0], u[3], u[6]] = tempb;
        [f[0], f[3], f[6]] = tempu;
        [d[0], d[3], d[6]] = tempf;
        [b[8], b[5], b[2]] = tempd;
      } else if (lastChar === "'") {
        [u[0], u[3], u[6]] = tempf;
        [f[0], f[3], f[6]] = tempd;
        [d[0], d[3], d[6]] = tempb;
        [b[8], b[5], b[2]] = tempu;
      } else {
        [u[0], u[3], u[6]] = tempd;
        [f[0], f[3], f[6]] = tempb;
        [d[0], d[3], d[6]] = tempu;
        [b[8], b[5], b[2]] = tempf;
      }
    }

    else if (move[0] === 'B')
    {
      const tempu = u.slice(0, 3).reverse();
      const templ = [l[0], l[3], l[6]];
      const tempd = d.slice(6);
      const tempr = [r[8], r[5], r[2]];
      if (move === 'B') {
        u.splice(0, 3, ...tempr.reverse());
        [l[0], l[3], l[6]] = tempu;
        d.splice(6, 3, ...templ);
        [r[8], r[5], r[2]] = tempd;
      } else if (lastChar === "'") {
         u.splice(0, 3, ...templ.reverse());
        [l[0], l[3], l[6]] = tempd;
        d.splice(6, 3, ...tempr);
        [r[8], r[5], r[2]] = tempu;
      } else {
        u.splice(0, 3, ...tempd.reverse());
        [r[8], r[5], r[2]] = templ;
        d.splice(6, 3, ...tempu);
        [l[0], l[3], l[6]] = tempr;
      }
    }

    if (move[move.length - 1] === "'") {
      this.rotateFaceCCW(
        this.faceMapping[move.slice(0, 1).toUpperCase()]
      );
    } else if (move[move.length - 1] === '2') {
      this.rotateFace180(
        this.faceMapping[move.slice(0, 1).toUpperCase()]
      );
    } else {
      this.rotateFaceCW(
        this.faceMapping[move.toUpperCase()]
      );
    }
    this.movesApplied.push(move);
  }

  rotateFaceCW(face) {
    const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]];

    [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp6, temp3, temp0, temp7, temp1, temp8, temp5, temp2];
  }

  rotateFaceCCW(face) {
    const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]];

    [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp2, temp5, temp8, temp1, temp7, temp0, temp3, temp6];
  }

  rotateFace180(face) {
    const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]];
    [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp8, temp7, temp6, temp5, temp3, temp2, temp1, temp0];
  }

  createAdjList() {
    const adjList = [];
    let simplifiedLastMove;
    if (this.movesApplied.length !== 0) {
      simplifiedLastMove = simplifyMove(this.movesApplied[this.movesApplied.length - 1]);
    } else {
      simplifiedLastMove = '';
    }

    for (let letter of MOVES) {
      if (this.allowedMoves.includes(letter) && letter !== simplifiedLastMove) {

        const cube1 = this.clone();
        const cube2 = this.clone();
        const cube3 = this.clone();
        cube1.move(letter);
        cube2.move(letter + "'");
        cube3.move(letter + '2');
        adjList.push(cube1, cube2, cube3);
      }
    }
    return adjList;
  }
}

