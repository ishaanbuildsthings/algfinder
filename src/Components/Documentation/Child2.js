import { memo } from 'react';
function Child2({ data }) {
  return (
    <div>I am child2, here is the data: {data}</div>
  );
}

export default memo(Child2);