import { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [output, setOutput] = useState("");
  const [bgcolor, setBgColor] = useState("white");
  const commands = {
    hello: () => {
      console.log("hii");
      setOutput("hii");
    },
    "add todo": () => {
      console.log("todo added");
      setOutput("todo added");
    },
    "add :item to list": (item) => {
      console.log(item);
      setOutput(`${item} added`);
    },
    "change color to :color": (color) => {
      setBgColor(color);
      setOutput(color);
    },
  };
  useEffect(() => {
    if (annyang) {
      // add commands
      annyang.addCommands(commands);
      // start listening

      return () => {
        annyang.abort(); // stop listennig while component unmount
      };
    } else {
      console.log("not available annyang");
    }
  }, []);

  return (
    <div style={{ backgroundColor: `${bgcolor}` }}>
      <h1>voice controll app</h1>
      <ul>
        commands:
        <li>hello</li>
        <li>add todo</li>
        <li>add "item" to list</li>
        <li>change color to "color name"</li>
      </ul>
      <button
        onClick={() => {
          annyang.start();
        }}
      >
        start
      </button>
      <button
        onClick={() => {
          annyang.abort();
        }}
      >
        stop
      </button>
      <br />
      <p>your Output is : {output}</p>
    </div>
  );
}

export default App;
