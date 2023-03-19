function determineComputerStrength() {
  // 0.25, 0.5, 1, 2, 4, 8, not supported on all browsers
  const memory = navigator.deviceMemory;
  if (memory === 8) return 'high';
  if (memory === 4) return 'medium';
  if (memory < 4) return 'low';
  // at this point the memory is undefined as not all browsers support it
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Mobile|Windows Phone/i.test(
      navigator.userAgent
    );
  if (isMobile) return 'low';
  return 'medium'; // probably on a computer
}

const strength = determineComputerStrength();

function determineDepths() {
  let threeMoveDepth;
  let fourMoveDepth;
  if (strength === 'low') {
    threeMoveDepth = 13;
    fourMoveDepth = 11;
  } else if (strength === 'medium') {
    threeMoveDepth = 14;
    fourMoveDepth = 12;
  } else if (strength === 'high') {
    threeMoveDepth = 15;
    fourMoveDepth = 13;
  }
  return [threeMoveDepth, fourMoveDepth];
}

export default determineDepths();
