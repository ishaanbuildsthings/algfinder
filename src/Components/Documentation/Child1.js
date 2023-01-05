function Child1({ handleTextChange }) {
  return (
    <div>
      I am child one
      <button onClick={() => handleTextChange(Math.random() + '')}>
        Click
      </button>
    </div>
  );
}

export default Child1;