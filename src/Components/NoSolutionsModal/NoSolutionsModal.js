import './NoSolutionsModal.css';
/**
 * @params
 * setNoSolutionsModal - a setter which can remove the modals existence
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