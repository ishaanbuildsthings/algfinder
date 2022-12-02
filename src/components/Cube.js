import React from 'react';

export default function Cube(props) {

  React.useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://cdn.cubing.net/js/cubing/twisty";
    script.type= "module";
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div>

      <twisty-player 
                    visualization="PG3D"
                    control-panel="none"
                    alg={props.cubeSate}
                    >
      </twisty-player>

  </div>
  );
}

