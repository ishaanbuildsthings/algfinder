import React from 'react';

function Toggle(props) {
  return (
    <div className="toggle" onClick={props.clickAction}>
      <button className="thumb"></button>
    </div>
  );
}

export default Toggle;