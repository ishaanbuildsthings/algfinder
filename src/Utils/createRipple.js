export default function createRipple(event, startingScale, backgroundColor) {
  // when create ripple is called via the onClick, an event is passed in, we grab the button from the event
  const button = event.currentTarget;
  // if there is already a ripple inside that button, remove it
  for (const existingRipple of button.getElementsByClassName('ripple')) {
    existingRipple.remove();
  }
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const longestSide = Math.max(button.clientHeight, button.clientWidth);
  ripple.style.width = `${longestSide}px`;
  ripple.style.height = `${longestSide}px`;
  // dynamically center the ripple
  ripple.style.left = `${-0.5 * (longestSide - button.clientWidth)}px`;
  ripple.style.top = `${-0.5 * (longestSide - button.clientHeight)}px`;
  ripple.style.backgroundColor = backgroundColor || '#B0B0B0';
  ripple.style.transform = `scale(${startingScale || 0})`;
  button.appendChild(ripple);
}
