import React from 'react';
import { PNG } from "sr-puzzlegen"



export default function Cube() {

  return (
    <div>

      <div id="cube"></div>

      {/* <script type="text/javascript"> */}
        {PNG("#cube", "cube")}
      {/* </script> */}

    </div>

  );
}

