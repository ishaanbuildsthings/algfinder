import './Toggle.css';

function Toggle({handleClick}) {
  return (
    <div className="toggle" onClick={handleClick}>
      <button className="thumb"></button>
    </div>
  );
}

export default Toggle;