import { memo } from 'react';

// this is actually imported but the linter does not detect it
import 'cubing/twisty'; // this lets us use the custom web component

import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cx from '@/utils/cx.js';
import processMoves from '@/utils/processMoves.js';

import '@/Components/CubePanel/CubePanel.css';

const MemoizedFontAwesomeIcon = memo(FontAwesomeIcon);

/**
 * This Cube component is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param
 * scramble - the currently entered scramble
 * @usage Used in Solve.js
 */
function Cube({ scramble }) {
  return (
    <div className="cubePanel">
      <twisty-player
        id="main-player"
        class="cube"
        visualization="PG3D"
        control-panel="none"
        background="none"
        experimental-setup-alg={processMoves(scramble)}
        tempo-scale="4"
      />
      <div className="dragIconAndText mainText">
        <MemoizedFontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg" />
        <p className={cx('dragText', 'dragTextSmall')}>&nbsp;&nbsp;Drag</p>
        <p className={cx('dragText', 'dragTextMedium')}>
          &nbsp;&nbsp;Drag cube
        </p>
        <p className={cx('dragText', 'dragTextLarge')}>
          &nbsp;&nbsp;Drag cube to view
        </p>
      </div>
    </div>
  );
}

export default memo(Cube); // the cube should only re-render if its props change
