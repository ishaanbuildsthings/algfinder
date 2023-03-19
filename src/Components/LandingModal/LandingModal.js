import { useCallback, useState } from 'react';

import Floater from 'react-floater';

import { Box, Checkbox } from '@gilbarbara/components';

import '@/Components/LandingModal/LandingModal.css';

/**
 * The content component displays what is inside the LandingModal, which is the Modal
 * that determines which joyride is displayed
 * @param {*}
 * handleClose - closes the modal
 * handleCanSolveCube - initiates the joyride if the user can solve a cube
 * handleCannotSolveCube - intiates the joyride if the user cannot solve a cube
 * dontShowDialogAgain - writes to local storage if the user wants to not see the modal again
 */
function Content({
  handleClose,
  handleCanSolveCube,
  handleCannotSolveCube,
  dontShowDialogAgain,
}) {
  const [checkboxState, setCheckboxState] = useState(false);
  // handles which joyride the user goes to
  const handleButtonClick = useCallback(
    (handleWhichJoyride) => {
      handleClose();
      handleWhichJoyride();
      if (checkboxState) dontShowDialogAgain();
    },
    // handle close always closes the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkboxState]
  );
  return (
    <Box
      className="landingModal"
      shadow="false"
      padding="xl"
      radius="md"
      variant="white"
      width="400px"
      flexBox="true"
      direction="column"
    >
      <h2>Welcome to Algfinder, an app that visually solves Rubik's Cubes.</h2>
      <h2 id="canSolveCube">To get started, can you solve a Rubik's Cube?</h2>
      <Box flexBox="true" justify="space-around">
        <button
          className="yesNoButton accentColor accentColorText"
          type="button"
          onClick={() => handleButtonClick(handleCanSolveCube)}
        >
          <p>Yes</p>
        </button>
        <button
          type="button"
          className="yesNoButton accentColor accentColorText"
          onClick={() => handleButtonClick(handleCannotSolveCube)}
        >
          No
        </button>
      </Box>
      <div className="alignCheckBox">
        <Checkbox
          onChange={(event) => {
            setCheckboxState(event.target.checked);
          }}
          label="Do not show this dialog again"
        />
      </div>
    </Box>
  );
}

/**
 * The LandingModal component conditionally renders the react-floater to show the landing modal.
 * @param
 * handleCanSolveCube - forwarded to Content
 * handleCannotSolveCube - forwarded to Content
 * dontShowDialogAgain - forwarded to Content
 * @usage - used in Solve.js
 */
export default function LandingModal({
  handleCanSolveCube,
  handleCannotSolveCube,
  dontShowDialogAgain,
}) {
  const [isShowing, setIsShowing] = useState(true);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isShowing && (
        <Floater
          component={
            <Content
              dontShowDialogAgain={dontShowDialogAgain}
              handleClose={() => setIsShowing(false)}
              handleCanSolveCube={handleCanSolveCube}
              handleCannotSolveCube={handleCannotSolveCube}
            />
          }
          open
          placement="center"
          styles={{
            options: {
              zIndex: 1000,
            },
          }}
        />
      )}
    </>
  );
}
