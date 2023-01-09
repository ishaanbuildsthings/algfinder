// the Solve.js file uses this code to interact with the cloud backend



// import { fetchURL } from '../Utils/fetchUrl.js';
// import { processMoves } from '../Utils/processMoves.js';
// import { sleep } from '../Utils/sleep.js';
// const baseURL = 'http://127.0.0.1:3001';
// const pollInterval = 1000; // ms

// async function solve(scramble, moveset, depth, setSolutionsState) {

//   setSolutionsState([]);
//   const txn_id = await fetchURL(`${baseURL}/solve?scramble=${processMoves(scramble).trim().split(' ').join(',')}&max-depth=${depth}&move-types=${moveset.join(',')}`);
//   // console.log(`got txn_id: ${txn_id}`); for debugging

//   let solutions = []; // solutions is the new diff we receive from backend
//   let allLocalSolutions = [];
//   let keepGoing = true;

//   do {
//       await sleep(pollInterval);
//       solutions = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`); // the new diff
//       allLocalSolutions = [...allLocalSolutions, ...solutions]; // memo solutions will keep adding new diffs, tracking the current solutions in local context
//       if (solutions[solutions.length - 1] === 'DONE') { // if the last id from the diff is 'DONE', we have hit the end
//         keepGoing = false;
//         allLocalSolutions.pop();
//         if (allLocalSolutions.length === 0) { // if we receive 'DONE', and the diff only contains that, we have no solutions
//           setNoSolutionsModal(true);
//         }
//       }
//     setSolutionsState(allLocalSolutions);
//   } while (keepGoing);
// }