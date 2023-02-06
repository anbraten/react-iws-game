import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    console.log("Howdy! I'm an effect that runs every render, yeii");
  });

  useEffect(() => {
    document.title = `You clicked ${count2} times`;
  }, []);

  useEffect(() => {
    console.log("This effect runs only on first render, bye");
  }, []);

  useEffect(() => {
    console.log("This effect depends on the first button");
  }, [count]);

  return (
    <div>
      <p>
        You clicked {count} times on the first button. This count number is the
        dependency of the useEffect that runs every render.
      </p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>
        You clicked {count2} times on the second button. No useEffect Hook is
        linked with this count number. :-(
      </p>
      <button onClick={() => setCount2(count2 + 1)}>Click me2</button>
    </div>
  );
}

export default App;
