import './Documentation.css';


function Documentation() {
  return (
    <>
    <div className="documentationDiv">
      <h2>How this works (for nerds)</h2>
      <p>The crux of this tool is the search algorithm needed to solve the supplied scramble. In the backend, we use a <a target="_blank" rel="noopener noreferrer" href="https://github.com/agrawalishaan/cubeexplorer/blob/main/main.py">bidirectional breadth-first search algorithm</a>&nbsp;to detect solutions.
      This algorithm reduces the time complexity of the naive solution of O(k<sup>n</sup>), to O(k<sup>n/2</sup>), where k is the branching factor and n is the search depth.
      A basic walkthrough of the algorithm is below.</p>
      <p>We start with two cubes:</p>
      <div className="cubeRow">

        <div className="cubeAndCaption">
          <img src="./600px_solved.png" alt="solved cube" className="cubePicture"></img>
          <p>A solved cube</p>
        </div>

        <div className="cubeAndCaption">
          <img src="./600px_R_U_scramble.png" alt="scrambled cube" className="cubePicture"></img>
          <p>A user-supplied scrambled cube</p>
        </div>

      </div>


      <hr></hr>
      <p>We then search 1-move adjacent states from the solved cube. Some examples would be:</p>
      <div className="cubeRow">

        <div className="cubeAndCaption">
          <img src="./600px_solved_F.png" alt="adjacent cube state to solved cube" className="cubePicture"></img>
          <p>Fig 1.1</p>
        </div>

        <div className="cubeAndCaption">
          <img src="./600px_solved_D.png" alt="adjacent cube state to solved cube" className="cubePicture"></img>
          <p>Fig 1.2</p>
        </div>

        <div className="cubeAndCaption">
        <img src="./600px_solved_R.png" alt="adjacent cube state to solved cube" className="cubePicture"></img>
          <p>Fig 1.3</p>
        </div>

      </div>
      <p>These adjacent states are added to a dictionary, which maps states reached starting from the solved cube, to lists of ways to reach said states.</p>


      <hr></hr>
      <p>We then repeat the 1-move adjacent search process, starting from the scrambled cube, adding these states to a second dictionary. Some examples would be:</p>
      <div className="cubeRow">

        <div className="cubeAndCaption">
          <img src="./600px_scrambled_R_U_D.png" alt="adjacent cube state to scrambled cube" className="cubePicture"></img>
          <p>Fig 2.1</p>
        </div>

        <div className="cubeAndCaption">
          <img src="./600px_solved_R.png" alt="adjacent cube state to scrambled cube" className="cubePicture"></img>
          <p>Fig 2.2</p>
        </div>

        <div className="cubeAndCaption">
        <img src="./600px_scrambled_R_U_Bprime.png" alt="adjacent cube state to scrambled cube" className="cubePicture"></img>
          <p>Fig 2.3</p>
        </div>

      </div>
      <p>Notice how Fig 1.3 and Fig 2.2 are the same! Since we have a collision, we know we can construct a solution to the scramble by connecting the two paths. We continue to search
        deeper until the user-supplied maximum algorithm length is reached, and return all possible solutions.
      </p>
      <p>As the breadth-first search starting from the solved cube is repeated work, it is <a href="" target="_blank" rel="noopener noreferrer">preprocessed as a binary encoding,</a> speeding up
      the time complexity even further.</p>


      <h2>Credits</h2>
      <p>This tool was primarily made by <a href="https://www.worldcubeassociation.org/persons/2015AGRA03" target="_blank" rel="noopener noreferrer">Ishaan Agrawal.</a></p>
      <p>With special thanks to Tony Peng, for spending more hours than any reasonable person ever should, teaching me advanced React, Javascript, Server/Client concepts, CSS Flexbox, and much more.</p>
      <p><a href="https://www.worldcubeassociation.org/persons/2016GOHT01" target="_blank" rel="noopener noreferrer">Timothy Goh,</a> for his work on
      setting up the backend server with Flask, connecting it to the frontend, implementing polling to make solutions update continuously, general code review,
      and answering many technical questions.</p>
      <p>And <a href="https://www.worldcubeassociation.org/persons/2006GARR01" target="_blank" rel="noopen noreferrer">Lucas Garron</a> and his co-contributors, for their beautiful <a href="https://js.cubing.net/cubing/" target="_blank" rel="noopener noreferrer">Rubik's Cube visual display.</a></p>


      <h2>Contributions</h2>
      <p>This is written in React + Flask and is open-source. If you would like to contribute, make feature requests, or report a bug, the Github repositories are here:&nbsp;
        <a href="https://github.com/agrawalishaan/cubeExplorerFrontend" target="_blank" rel="noopen noreferrer">Front End</a>&nbsp;|&nbsp;
        <a href="https://github.com/agrawalishaan/cubeexplorer" target="_blank" rel="noopen noreferrer">Back End</a>
      </p>
    </div>
    </>
  );
}

export default Documentation;