import './Faq.css';
// todo: add why there are restricited move depths, learn notation, this isnt useful as i dont know how to get to this state, scroll up arrow, table of contents
export default function Faq() {
  return (
    <>
      <div className="documentationDiv">
        <h2>Who made this?</h2>
        <p>This tool was made by <a href="https://www.worldcubeassociation.org/persons/2015AGRA03" target="_blank" rel="noopener noreferrer">Ishaan Agrawal.</a> In 2017, I broke the&nbsp;
          <a href="https://www.youtube.com/watch?v=N8MNEngonTs" target="_blank" rel="noopener noreferrer">
            world record&nbsp;
          </a>
          for solving a Rubik's Cube while blindfolded by spending thousands of hours finding algorithms by hand, to make my solutions hyper-efficient. I made this tool to automate that process for others and save time!
        </p>
        <p>
          I am currently looking for an entry level Web Development job, if you know of an opportunity, would like to introduce someone to me, or just want to chat, please contact me:&nbsp;
          <a href="https://www.ishaan.ag" target="_blank" rel="noopener noreferrer">Portfolio & Resume, </a>
          <a href="mailto:me@ishaan.ag"> Email, </a>
          <a href="https://github.com/agrawalishaan" target="_blank" rel="noopener noreferrer"> Github</a>
        </p>
        <p>Special thanks to Tony Peng and <a href="https://www.worldcubeassociation.org/persons/2016GOHT01" target="_blank" rel="noopener noreferrer">Timothy Goh,</a> for spending more time than anyone reasonably should, teaching me advanced React, Javascript, Server/Client concepts, CSS Flexbox, and much more.</p>
        <p>And <a href="https://www.worldcubeassociation.org/persons/2006GARR01" target="_blank" rel="noopen noreferrer">Lucas Garron</a> and his co-contributors, for their beautiful <a href="https://js.cubing.net/cubing/" target="_blank" rel="noopener noreferrer">Rubik's Cube visual display.</a></p>

        <h2>How can I help?</h2>
        <p>This is written in React and is open-source. If you would like to contribute, make feature requests, or report bugs, the Github repository is&nbsp;
          <a href="https://github.com/agrawalishaan/cubeExplorerFrontend" target="_blank" rel="noopen noreferrer">here.</a>
        </p>

        <h2>How does this program work? (for nerds)</h2>
        <p>The crux of this tool is the search algorithm needed to solve the supplied scramble. I implemented a <a target="_blank" rel="noopener noreferrer" href="https://github.com/agrawalishaan/cubeExplorerFrontend/blob/main/public/Workers/SolveWorker.js">bidirectional breadth-first search algorithm</a>&nbsp;to detect solutions.
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
        <p>Notice how Fig 1.3 and Fig 2.2 are the same! Since there is a collision, we know we can construct a solution to the scramble by connecting the two paths. We continue to search
          deeper until the user-supplied maximum algorithm length is reached, and return all possible solutions.
        </p>
        <p>As the breadth-first search starting from the solved cube is repeated work, it is <a href="" target="_blank" rel="noopener noreferrer">preprocessed as a binary encoding,</a> speeding up
          the time even further.</p>
      </div>
    </>
  );
};