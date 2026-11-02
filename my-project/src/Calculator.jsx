import { useState } from "react";

function Calculator() {
  const [input, setInput] = useState("");

  const handleInput = (value) => {
    setInput(input + value);
  };

  const handleDelete = () => {
    setInput("");
  };

  const handleResult = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput("error");
    }
  };

  return (
    <div>
      {/* calculator */}
      <div className="mt-15 w-70 p-2 flex items-center justify-self-center bg-gray-400  border-2 rounded-xl">
        <div>
          <div className="border-2 h-20 w-full  bg-black rounded-xl">
            <input
              type="text"
              placeholder="Enter value"
              className="focus:ring-0 w-full rounded-xl h-19 text-white text-lg  items-center "
              value={input}
              readOnly
            />
          </div>
          <div className="gap-2.5 grid grid-cols-4 mt-2 pr-2">
            <button
              onClick={() => handleInput("1")}
              className="bg-black border-white text-white h-15 w-15"
            >
              1
            </button>
            <button
              onClick={() => handleInput("2")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              2
            </button>
            <button
              onClick={() => handleInput("3")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              3
            </button>
            <button
              onClick={() => handleInput("+")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              +
            </button>
            <button
              onClick={() => handleInput("4")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              4
            </button>
            <button
              onClick={() => handleInput("5")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              5
            </button>
            <button
              onClick={() => handleInput("6")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              6
            </button>
            <button
              onClick={() => handleInput("-")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              -
            </button>
            <button
              onClick={() => handleInput("7")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              7
            </button>
            <button
              onClick={() => handleInput("8")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              8
            </button>
            <button
              onClick={() => handleInput("9")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              9
            </button>
            <button
              onClick={() => handleInput("/")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              /
            </button>
            <button
              onClick={() => handleInput("0")}
              className="bg-black border-white text-white  h-15 w-15"
            >
              0
            </button>
            <button
              onClick={() => handleInput("*")}
              className="bg-black border-white text-white h-15 w-15"
            >
              *
            </button>
            <button
              onClick={handleResult}
              className="bg-black border-white text-white  h-15 w-15"
            >
              =
            </button>
            <button
              onClick={handleDelete}
              className="bg-black border-white text-white  h-15 w-15"
            >
              C
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
