import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import TwistyPlayer from 'cubing/twisty'; // this lets us use the custom web component
import processMoves from '../../Utils/processMoves.js';
import './CubePanel.css';
import cx from '../../Utils/cx.js';

const MemoizedFontAwesomeIcon = memo(FontAwesomeIcon);

/**
 * This Cube component is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*}
 * scramble - the currently entered scramble
 * @usage Used in Solve.js
 */
function Cube({ scramble }) {

  return (
    <div className="cubePanel">
      <twisty-player
        class="mycube"
        visualization="PG3D"
        control-panel="none"
        background="none"
        experimental-setup-alg={processMoves(scramble)}
        // ! new alg={processMoves(scramble)}
        tempo-scale="4"
      ></twisty-player>
      <div className="dragIconAndText mainText">
        <MemoizedFontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg" />
        <p className={cx('dragText', 'dragTextSmall')}>&nbsp;&nbsp;Drag</p>
        <p className={cx('dragText', 'dragTextMedium')}>&nbsp;&nbsp;Drag cube</p>
        <p className={cx('dragText', 'dragTextLarge')}>&nbsp;&nbsp;Drag cube to view</p>
      </div>
    </div>
  );
}

export default memo(Cube); // the cube should only re-render if its props change