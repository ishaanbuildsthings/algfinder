// import { simplifyMove } from "./AlgHandler.js";

// const MOVES = [
//   'U', 'R', 'F', 'B', 'L', 'D',
//   'u', 'r', 'f', 'b', 'l', 'd',
//   'S', 'E', 'M', 'x', 'y', 'z'
// ];

// const SOLVED_STICKER_STATE = [
//   '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜',
//   '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩',
//   '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥',
//   '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦',
//   '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧',
//   '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨',
// ]

// class Cube {
//   constructor() {
//     this.movesApplied = [];
//     this.parentCube = null;
//     this.depth = 0;
//     this.allowedMoves = [];

//     this.uFace = SOLVED_STICKER_STATE.slice(0, 9);
//     this.fFace = SOLVED_STICKER_STATE.slice(9, 18);
//     this.rFace = SOLVED_STICKER_STATE.slice(18, 27);
//     this.bFace = SOLVED_STICKER_STATE.slice(27, 36);
//     this.lFace = SOLVED_STICKER_STATE.slice(36, 45);
//     this.dFace = SOLVED_STICKER_STATE.slice(45, 54);

//     // to allow rotating the correct faces based on the letter passed to move function, and to get the updated state
//     this.faceMapping = {
//       'U': this.uFace, 'F': this.fFace, 'R': this.rFace,
//       'D': this.dFace, 'L': this.lFace, 'B': this.bFace
//     }
//   }

//   _getFace(move) {
//     if (move === 'U') return this.uFace;
//     if (move === 'F') return this.fFace;
//     if (move === 'R') return this.rFace;
//     if (move === 'D') return this.dFace;
//     if (move === 'L') return this.lFace;
//     if (move === 'B') return this.bFace;
//   }

//   _clone() {
//     const clone = new Cube();
//     clone.movesApplied = [...this.movesApplied];
//     clone.uFace = [...this.uFace];
//     clone.fFace = [...this.fFace];
//     clone.rFace = [...this.rFace];
//     clone.bFace = [...this.bFace];
//     clone.lFace = [...this.lFace];
//     clone.dFace = [...this.dFace];

//     clone.faceMapping = {
//       'U': clone.uFace, 'F': clone.fFace, 'R': clone.rFace,
//       'D': clone.dFace, 'L': clone.lFace, 'B': clone.bFace
//     };
//     return clone;
//   }

//   // returns string representation of state
//   getState() {
//     return this.uFace.join('') + this.fFace.join('') + this.rFace.join('') + this.dFace.join('') + this.lFace.join('') + this.bFace.join('');
//   }

//   move(move) {

//     const handleU = () => {
//       const tempf = f.slice(0, 3);
//       const tempr = r.slice(0, 3);
//       const tempb = b.slice(0, 3);
//       const templ = l.slice(0, 3);
//       if (lastChar === "'") {
//         l.splice(0, 3, ...tempb);
//         b.splice(0, 3, ...tempr);
//         r.splice(0, 3, ...tempf);
//         f.splice(0, 3, ...templ);
//       } else if (lastChar === '2') {
//         l.splice(0, 3, ...tempr);
//         b.splice(0, 3, ...tempf);
//         r.splice(0, 3, ...templ);
//         f.splice(0, 3, ...tempb);
//       } else {
//         l.splice(0, 3, ...tempf);
//         b.splice(0, 3, ...templ);
//         r.splice(0, 3, ...tempb);
//         f.splice(0, 3, ...tempr);
//       }
//     }

//     const handleR = () => {
//       const tempu = [u[2], u[5], u[8]];
//       const tempb = [b[0], b[3], b[6]];
//       const tempd = [d[2], d[5], d[8]];
//       const tempf = [f[2], f[5], f[8]];
//       if (lastChar === "'") {
//         [b[0], b[3], b[6]] = tempd.reverse();
//         [d[2], d[5], d[8]] = tempf;
//         [f[2], f[5], f[8]] = tempu;
//         [u[2], u[5], u[8]] = tempb.reverse();
//       } else if (lastChar === '2') {
//         [b[0], b[3], b[6]] = tempf.reverse();
//         [d[2], d[5], d[8]] = tempu;
//         [f[2], f[5], f[8]] = tempb.reverse();
//         [u[2], u[5], u[8]] = tempd;
//       } else {
//         [b[0], b[3], b[6]] = tempu.reverse();
//         [d[2], d[5], d[8]] = tempb.reverse();
//         [f[2], f[5], f[8]] = tempd;
//         [u[2], u[5], u[8]] = tempf;
//       }
//     };

//     const handleF = () => {
//       const tempu = u.slice(6);
//       const tempr = [r[0], r[3], r[6]];
//       const tempd = d.slice(0, 3).reverse();
//       const templ = [l[8], l[5], l[2]];
//       if (lastChar === "'") {
//         u.splice(6, 3, ...tempr);
//         [r[0], r[3], r[6]] = tempd;
//         d.splice(0, 3, ...templ.reverse());
//         [l[2], l[5], l[8]] = tempu.reverse();
//       } else if (lastChar === '2') {
//         u.splice(6, 3, ...tempd);
//         [r[0], r[3], r[6]] = templ;
//         d.splice(0, 3, ...tempu.reverse());
//         [l[8], l[5], l[2]] = tempr;
//       } else {
//         u.splice(6, 3, ...templ);
//         [r[0], r[3], r[6]] = tempu;
//         d.splice(0, 3, ...tempr.reverse());
//         [l[8], l[5], l[2]] = tempd;
//       }
//     };

//     const handleD = () => {
//       const tempf = f.slice(6);
//       const tempr = r.slice(6);
//       const tempb = b.slice(6);
//       const templ = l.slice(6);
//       if (lastChar === "'") {
//         f.splice(6, 3, ...tempr);
//         l.splice(6, 3, ...tempf);
//         b.splice(6, 3, ...templ);
//         r.splice(6, 3, ...tempb);
//       } else if (lastChar === '2') {
//         f.splice(6, 3, ...tempb);
//         r.splice(6, 3, ...templ);
//         b.splice(6, 3, ...tempf);
//         l.splice(6, 3, ...tempr);
//       } else {
//         f.splice(6, 3, ...templ);
//         l.splice(6, 3, ...tempb);
//         b.splice(6, 3, ...tempr);
//         r.splice(6, 3, ...tempf);
//       }
//     };

//     const handleL = () => {
//       const tempu = [u[0], u[3], u[6]];
//       const tempf = [f[0], f[3], f[6]];
//       const tempd = [d[0], d[3], d[6]];
//       const tempb = [b[8], b[5], b[2]];
//       if (lastChar === "'") {
//         [u[0], u[3], u[6]] = tempf;
//         [f[0], f[3], f[6]] = tempd;
//         [d[0], d[3], d[6]] = tempb;
//         [b[8], b[5], b[2]] = tempu;
//       } else if (lastChar === '2') {
//         [u[0], u[3], u[6]] = tempd;
//         [f[0], f[3], f[6]] = tempb;
//         [d[0], d[3], d[6]] = tempu;
//         [b[8], b[5], b[2]] = tempf;
//       } else {
//         [u[0], u[3], u[6]] = tempb;
//         [f[0], f[3], f[6]] = tempu;
//         [d[0], d[3], d[6]] = tempf;
//         [b[8], b[5], b[2]] = tempd;
//       }
//     };

//     const handleB = () => {
//       const tempu = u.slice(0, 3).reverse();
//       const templ = [l[0], l[3], l[6]];
//       const tempd = d.slice(6);
//       const tempr = [r[8], r[5], r[2]];
//       if (lastChar === "'") {
//          u.splice(0, 3, ...templ.reverse());
//         [l[0], l[3], l[6]] = tempd;
//         d.splice(6, 3, ...tempr);
//         [r[8], r[5], r[2]] = tempu;
//       } else if (lastChar === '2') {
//         u.splice(0, 3, ...tempd.reverse());
//         [r[8], r[5], r[2]] = templ;
//         d.splice(6, 3, ...tempu);
//         [l[0], l[3], l[6]] = tempr;
//       } else {
//          u.splice(0, 3, ...tempr.reverse());
//         [l[0], l[3], l[6]] = tempu;
//         d.splice(6, 3, ...templ);
//         [r[8], r[5], r[2]] = tempd;
//       }
//     };

//     const handleS = () => {
//       const tempu = u.slice(3, 6);
//       const tempr = [r[1], r[4], r[7]];
//       const tempd = d.slice(3, 6).reverse();
//       const templ = [l[7], l[4], l[1]];
//       if (move === 'S' || move === 'f' || move === "b'") {
//         u.splice(3, 3, ...templ);
//         [r[1], r[4], r[7]] = tempu;
//         d.splice(3, 3, ...tempr.reverse());
//         [l[7], l[4], l[1]] = tempd;
//       } else if (move === "S'" || move === "f'" || move === 'b') {
//         u.splice(3, 3, ...tempr);
//         [r[1], r[4], r[7]] = tempd;
//         d.splice(3, 3, ...templ.reverse());
//         [l[7], l[4], l[1]] = tempu;
//       } else { // S2/f2/b2
//         u.splice(3, 3, ...tempd);
//         [r[1], r[4], r[7]] = templ;
//         d.splice(3, 3, ...tempu.reverse());
//         [l[7], l[4], l[1]] = tempr;
//       }
//     };

//     const handleM = () => {
//       const tempu = [u[1], u[4], u[7]];
//       const tempf = [f[1], f[4], f[7]];
//       const tempd = [d[1], d[4], d[7]];
//       const tempb = [b[7], b[4], b[1]];
//       if (move === 'M' || move === 'l' || move === "r'") {
//         [f[1], f[4], f[7]] = tempu;
//         [d[1], d[4], d[7]] = tempf;
//         [b[7], b[4], b[1]] = tempd;
//         [u[1], u[4], u[7]] = tempb;
//       } else if (move === "M'" || move === "l'" || move === 'r') {
//         [f[1], f[4], f[7]] = tempd;
//         [u[1], u[4], u[7]] = tempf;
//         [b[7], b[4], b[1]] = tempu;
//         [d[1], d[4], d[7]] = tempb;
//       } else { // M2/l2/r2
//         [f[1], f[4], f[7]] = tempb;
//         [u[1], u[4], u[7]] = tempd;
//         [b[7], b[4], b[1]] = tempf;
//         [d[1], d[4], d[7]] = tempu;
//       }
//     };

//     const handleE = () => {
//       const tempf = f.slice(3, 6);
//       const tempr = r.slice(3, 6);
//       const tempb = b.slice(3, 6);
//       const templ = l.slice(3, 6);
//       if (move === 'E' || move === 'd' || move === "u'") {
//         f.splice(3, 3, ...templ);
//         r.splice(3, 3, ...tempf);
//         b.splice(3, 3, ...tempr);
//         l.splice(3, 3, ...tempb);
//       } else if (move === "E'" || move === "d'" || move === 'u') {
//         f.splice(3, 3, ...tempr);
//         r.splice(3, 3, ...tempb);
//         b.splice(3, 3, ...templ);
//         l.splice(3, 3, ...tempf);
//       } else { // E2/d2/u2
//         f.splice(3, 3, ...tempb);
//         r.splice(3, 3, ...templ);
//         b.splice(3, 3, ...tempf);
//         l.splice(3, 3, ...tempr);
//       }
//     };

//     const handleX = () => {
//       const tempu = u.slice();
//       const tempb = b.slice();
//       const tempd = d.slice();
//       const tempf = f.slice();

//       if (move === 'x') {
//         u.splice(0, 9, ...tempf);
//         b.splice(0, 9, ...tempu.reverse());
//         d.splice(0, 9, ...tempb.reverse());
//         f.splice(0, 9, ...tempd);
//         this._rotateFace(l, -90);
//         this._rotateFace(r, 90);
//       } else if (move === 'x2') {
//         u.splice(0, 9, ...tempd);
//         b.splice(0, 9, ...tempf.reverse());
//         d.splice(0, 9, ...tempu);
//         f.splice(0, 9, ...tempb.reverse());
//         this._rotateFace(l, 180);
//         this._rotateFace(r, 180);
//       } else if (move === "x'") {
//         u.splice(0, 9, ...tempb.reverse());
//         f.splice(0, 9, ...tempu);
//         d.splice(0, 9, ...tempf);
//         b.splice(0, 9, ...tempd.reverse());
//         this._rotateFace(l, 90);
//         this._rotateFace(r, -90);
//       }
//     };

//     const handleY = () => {
//       const tempf = f.slice();
//       const templ = l.slice();
//       const tempb = b.slice();
//       const tempr = r.slice();

//       if (move === 'y') {
//         f.splice(0, 9, ...tempr);
//         r.splice(0, 9, ...tempb);
//         b.splice(0, 9, ...templ);
//         l.splice(0, 9, ...tempf);
//         this._rotateFace(u, 90);
//         this._rotateFace(d, -90);
//       } else if (move === 'y2') {
//         f.splice(0, 9, ...tempb);
//         r.splice(0, 9, ...templ);
//         b.splice(0, 9, ...tempf);
//         l.splice(0, 9, ...tempr);
//         this._rotateFace(u, 180);
//         this._rotateFace(d, -180);
//       } else if (move === "y'") {
//         f.splice(0, 9, ...templ);
//         r.splice(0, 9, ...tempf);
//         b.splice(0, 9, ...tempr);
//         l.splice(0, 9, ...tempb);
//         this._rotateFace(u, -90);
//         this._rotateFace(d, 90);
//       }
//     };

//     const handleZ = () => {
//       const tempu = u.slice();
//       const tempr = r.slice();
//       const tempd = d.slice();
//       const templ = l.slice();

//       const helpZ = (faceToChange, old) => {
//         faceToChange.splice(0, 9, old[6], old[3], old[0], old[7], old[4], old[1], old[8], old[5], old[2]);
//       };

//       const helpZPrime = (faceToChange, old) => {
//         faceToChange.splice(0, 9, old[2], old[5], old[8], old[1], old[4], old[7], old[0], old[3], old[6]);
//       };

//       if (move === 'z') {
//         helpZ(u, templ);
//         helpZ(r, tempu);
//         helpZ(d, tempr);
//         helpZ(l, tempd);
//         this._rotateFace(f, 90);
//         this._rotateFace(b, -90);
//       } else if (move === 'z2') {
//         u.splice(0, 9, ...tempd.reverse()); // need splice as we are mutating the actual face
//         r.splice(0, 9, ...templ.reverse());
//         d.splice(0, 9, ...tempu.reverse());
//         l.splice(0, 9, ...tempr.reverse());
//         this._rotateFace(f, 180);
//         this._rotateFace(b, 180);
//       } else if (move === "z'") {
//         helpZPrime(u, tempr);
//         helpZPrime(r, tempd);
//         helpZPrime(d, templ);
//         helpZPrime(l, tempu);
//         this._rotateFace(f, -90);
//         this._rotateFace(b, 90);
//       }
//     };

//     this.movesApplied.push(move);

//     const lastChar = move[move.length - 1];
//     const [u, f, r, d, l, b] = [this.uFace, this.fFace, this.rFace, this.dFace, this.lFace, this.bFace];

//     // handle outer moves
//     if (move[0] === 'U' || move[0] === 'u') {
//       handleU();
//     } else if (move[0] === 'R' || move[0] === 'r') {
//       handleR();
//     } else if (move[0] === 'F' || move[0] === 'f') {
//       handleF();
//     } else if (move[0] === 'D' || move[0] === 'd') {
//       handleD();
//     } else if (move[0] === 'L' || move[0] === 'l') {
//       handleL();
//     } else if (move[0] === 'B' || move[0] === 'b') {
//       handleB();
//     }
//     // handle inner moves
//     if (move[0] === 'S' || move[0] === 'f' || move[0] === 'b') {
//       handleS();
//     } else if (move[0] === 'M' || move[0] === 'l' || move[0] === 'r') {
//       handleM();
//     } else if (move[0] === 'E' || move[0] === 'd' || move[0] === 'u') {
//       handleE();
//     }
//     // handle rotations
//     if (move[0] === 'x') {
//       handleX();
//     } if (move[0] === 'y') {
//       handleY();
//     } if (move[0] === 'z') {
//       handleZ();
//     }

//     if (move[0] === 'x' || move[0] === 'y' || move[0] === 'z' || move[0] === 'S' || move[0] === 'M' || move[0] === 'E') {
//       return; // don't rotate any more faces
//     }

//     // rotate the correct face the right amount of degrees based on the move
//     if (move[move.length - 1] === "'") {
//       this._rotateFace(
//         this.faceMapping[move.slice(0, 1).toUpperCase()],
//         -90
//       );
//     } else if (move[move.length - 1] === '2') {
//      this._rotateFace(
//         this.faceMapping[move.slice(0, 1).toUpperCase()],
//         180
//       );
//     } else {
//        this._rotateFace(
//         this.faceMapping[move.slice(0, 1).toUpperCase()],
//         90
//       );
//     }

//   }

//   _rotateFace(face, degrees) {
//     const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]];
//     if (degrees === 90) {
//       [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp6, temp3, temp0, temp7, temp1, temp8, temp5, temp2];
//     } else if (degrees === -90) {
//       [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp2, temp5, temp8, temp1, temp7, temp0, temp3, temp6];
//     } else {
//         [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] = [temp8, temp7, temp6, temp5, temp3, temp2, temp1, temp0];
//     }
//   }

//   // creates a list of cubes that are adjacent to the current cube, adjacenies generated by allowed movetypes minus most recently applied move type
//   createAdjList() {
//     const adjList = [];
//     let simplifiedLastMove;
//     if (this.movesApplied.length !== 0) {
//       simplifiedLastMove = simplifyMove(this.movesApplied[this.movesApplied.length - 1]);
//     } else {
//       simplifiedLastMove = '';
//     }

//     for (let letter of MOVES) {
//       if (this.allowedMoves.includes(letter) && letter !== simplifiedLastMove) {

//         const cube1 = this._clone();
//         const cube2 = this._clone();
//         const cube3 = this._clone();
//         cube1.move(letter);
//         cube2.move(letter + "'");
//         cube3.move(letter + '2');
//         adjList.push(cube1, cube2, cube3);
//       }
//     }
//     return adjList;
//   }
// }

// export default Cube;