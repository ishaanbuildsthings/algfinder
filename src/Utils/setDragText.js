export default function setDragText(windowSize) {
    if (windowSize.width < 360) {
      return 'Drag';
    } else if (windowSize.width <= 767) {
      return 'Drag cube';
    }
    return 'Drag cube to view';
  }