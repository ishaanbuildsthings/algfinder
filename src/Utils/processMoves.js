// when a user enters bad data inside the scramble field, such as "R F2''' U F", this function parses it
export default function processMoves(scramble) {
  let scrambleNoSpaces = '';
  let result = '';
  // remove all spaces
  for (let char of scramble) {
    if (char !== ' ') {
      scrambleNoSpaces += char;
    }
  }
  for (let i = 0; i < scrambleNoSpaces.length; i++) {
    if (i === scrambleNoSpaces.length - 1 && /[RUFLDBxyzEMSrufldb]/.test(scrambleNoSpaces[i])) { // if at the last move and a move matches, add that and return the string
      return result + scrambleNoSpaces[i];
    }
    // add the moves
    if (/[RUFLDBxyzEMSrufldb]/.test(scrambleNoSpaces[i])) {
      if (scrambleNoSpaces[i + 1] === "'" || scrambleNoSpaces[i + 1] === '2') {
        result += (scrambleNoSpaces[i] + scrambleNoSpaces[i + 1] + ' ');
      } else {
        result += scrambleNoSpaces[i] + ' ';
      }
    }
  }
  return result.trim();
};