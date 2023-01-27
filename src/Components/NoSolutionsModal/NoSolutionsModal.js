import './NoSolutionsModal.css';
/**
 * This is the modal that appears when no solutions exist for a scramble
 * @usage used in Solve.js
 */
function NoSolutionsModal() {

  return (
   <div className="noSolutionsModal errorColor">
      <p>No solutions exist!</p>
   </div>
        );
}

export default NoSolutionsModal;