export const joyrideCanSolveSteps = [
  {
    target: '#scrambleInput',
    content:
      'Awesome! This is where you enter the scramble for the state of the cube you want to solve. Longer scrambles take more time to solve.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '#depthInput',
    content:
      'This is where you enter the maximum length of solutions you want to find. Bigger depths take more time to solve.',
    placement: 'right',
  },
  {
    target: '.buttonGrid',
    content:
      'Finally, this is where you select a moveset. Solutions will be restricted to moves using the provided moveset. Larger movesets take more time to solve.',
    placement: 'right',
  },
  {
    target: '.submitButton',
    content:
      'Once you have filled all the fields, click here to generate solutions.',
    placement: 'right',
  },
  {
    target: '.randomExampleButton',
    content:
      'You can also click on this button at any point to fill the fields with random queries.',
    placement: 'right',
  },
  {
    target: '.scrollableSolutions',
    content:
      'Generated solutions will appear here. You can click on the animate button next to any solution to see the cube solve itself in real-time!',
    placement: 'right',
  },
  {
    target: '.FAQ',
    content: (
      <>
        That's it!
        <p>
          This tool was made by{' '}
          <a
            href="https://www.worldcubeassociation.org/persons/2015AGRA03"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ishaan Agrawal.
          </a>
        </p>
        <p>
          I am currently looking for an entry level Web Development job, if you
          know of an opportunity, would like to introduce someone to me, or just
          want to chat, please contact me:&nbsp;
          <a
            href="https://www.ishaan.ag"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio & Resume,{' '}
          </a>
          <a href="mailto:me@ishaan.ag"> Email, </a>
          <a
            href="https://github.com/agrawalishaan"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Github
          </a>
        </p>
        <p>Source code for the project</p>
      </>
    ),
    placement: 'bottom',
  },
  {
    target: '.FAQ',
    content:
      "If you want to learn about how the solving algorithm works, see why I made this, learn Rubik's Cube notation, or much more, check out the FAQ!",
    placement: 'bottom',
  },
];

export const joyrideCannotSolveSteps = [
  {
    target: '.randomExampleButton',
    content:
      "That's totally fine! Let's start by clicking this button, which will generate a random scramble for the cube.",
    placement: 'right',
    disableBeacon: true,
    spotlightClicks: true,
    hideCloseButton: true,
    hideFooter: true,
  },
  {
    target: '#scrambleInput',
    content:
      "A random scramble was generated. The text here is Rubik's Cube notation, and represents the moves applied to the cube. You can learn how to write your own Rubik's Cube notation in the FAQ in the navigation bar.",
    placement: 'right',
  },
  {
    target: '#depthInput',
    content:
      'A maximum depth was also selected. This means we will only see solutions that are at most this many moves. Deeper solutions take longer to calculate.',
    placement: 'right',
  },
  {
    target: '.buttonGrid',
    content:
      'Finally, a moveset was chosen. We will restrict our solutions to only use these moves on the cube.',
    placement: 'right',
  },
  {
    target: '.submitButton',
    content: 'Now that our queries are entered, click here to solve the cube!',
    placement: 'right',
    disableBeacon: true,
    spotlightClicks: true,
    hideCloseButton: true,
    hideFooter: true,
  },
  {
    target: '.FAQ',
    content: (
      <>
        <p>
          This tool was made by{' '}
          <a
            href="https://www.worldcubeassociation.org/persons/2015AGRA03"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ishaan Agrawal.
          </a>
        </p>
        <p>
          I am currently looking for an entry level Web Development job, if you
          know of an opportunity, would like to introduce someone to me, or just
          want to chat, please contact me:&nbsp;
          <a
            href="https://www.ishaan.ag"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio & Resume,{' '}
          </a>
          <a href="mailto:me@ishaan.ag"> Email, </a>
          <a
            href="https://github.com/agrawalishaan"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Github
          </a>
        </p>
        <p>Source code for the project</p>
      </>
    ),
    placement: 'bottom',
  },
  {
    target: '.scrollableSolutions',
    content:
      "If you want to learn about how the solving algorithm works, see why I made this, learn Rubik's Cube notation, or much more, check out the FAQ!",
    placement: 'bottom',
  },
];
