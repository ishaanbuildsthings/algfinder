import './NoSolutionsModal.css';
/**
 * This is the modal that appears when no solutions exist for a scramble
 * @usage used in Solve.js
 */
export default function NoSolutionsModal() {
  return (
    <div className="noSolutionsModal errorColor">
      <p>No solutions exist!</p>
    </div>
  );
}
