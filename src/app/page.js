"use client";
import "./globals.css"; // Import your styles

import { useState, useEffect, useRef } from "react";
import { useKeyPress } from "./useKeyPress";

function getDupes(arr) {
  //debugger;
  // Create a map to store the occurrences of each second element
  let dupesObject;
  const occurrences = arr.reduce((acc, [_, value]) => {
    if (!acc[value]) {
      acc[value] = 0;
    }
    acc[value]++;
    return acc;
  }, {});
  const duplicates = arr.filter(([_, value]) => occurrences[value] > 1);
  console.log({ duplicates });
  let i = 0;

  for (let element in duplicates) {
    //debugger;

    console.log("loop element ", element);
    // console.log("option ", element[0]);
    // console.log("count ", element[1]);
    let option = duplicates[element][0];
    let count = duplicates[element][1];
    if (!dupesObject) {
      dupesObject = { [count]: [option] };
      continue;
    }
    //let currentSubset = dupesObject[i];
    for (let ele in dupesObject) {
      //
      console.log("dupes[count] ", dupesObject[count]);
      console.log("ele ", ele);
      console.log("option ", option);
      console.log("count ", count);
      if (count == ele) {
        if (option in dupesObject[count]) {
          console.log("dupes");
          break;
        } else {
          console.log("woohoo push");
          dupesObject[count].push(option);
        }

        break;
      } else {
        dupesObject[count] = [option];
        break;
      }
    }
    // if (
    //   currentSubset[currentSubset.length - 1] &&
    //   currentSubset[currentSubset.length - 1].includes(element[0])
    // ) {
    //   console.log("exists and has element");
    //   dupesObject[i][currentSubset.length - 1].push(element[0]);
    //   console.log({ dupesObject });
    // } else if (
    //   currentSubset[currentSubset.length - 1] &&
    //   !currentSubset[currentSubset.length - 1].includes(element[0])
    // ) {
    //   console.log("exists and does not have element ");
    //   i++;
    //   dupesObject[i] = [element[0]];
    //   console.log({ dupesObject });
    // } else {
    //   // empty array
    //   console.log("I'm so empty and sad");
    //   dupesObject[i].push(element[0]);
    //   console.log({ dupesObject });
    // }
  }
  console.log({ dupesObject });
  console.log({ duplicates });
  return dupesObject;
}

export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareToIndex, setCompareToIndex] = useState(currentIndex + 1);
  const [matches, setMatches] = useState(new Map());
  const [winnerCount, setWinnerCount] = useState(new Map());
  const [priorities, setPriorities] = useState({});
  const [ties, setTies] = useState([]);
  const [dumpedPriorities, setDumpedPriorities] = useState([]);
  const [topPriorities, setToppedPriorities] = useState([]);
  const [focusedButton, setFocusedButton] = useState("addTask");

  const addButtonRef = useRef(null);
  const letsGoButtonRef = useRef(null);
  const taskInputRef = useRef(null);

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];

  const onKeyPress = (event) => {
    console.log("onKeyPress", event);
    if (event.key === "ArrowLeft") {
      setFocusedButton((prev) =>
        prev === "letsGo"
          ? "addTask"
          : prev === "taskInput"
          ? "letsGo"
          : "taskInput"
      );
    }
    if (event.key === "ArrowRight") {
      setFocusedButton((prev) =>
        prev === "letsGo"
          ? "taskInput"
          : prev === "addTask"
          ? "letsGo"
          : "addTask"
      );
    }
    if (event.key === "Escape") {
      setFocusedButton("escapeAll");
    }
  };

  useKeyPress(["ArrowLeft", "ArrowRight", "Escape"], onKeyPress);

  useEffect(() => {
    if (focusedButton === "addTask") {
      addButtonRef.current.focus();
    } else if (focusedButton === "letsGo") {
      letsGoButtonRef.current.focus();
    } else if (focusedButton === "letsGoBlur") {
      letsGoButtonRef.current.blur();
    } else if (focusedButton === "addTaskBlur") {
      addButtonRef.current.blur();
    } else if (focusedButton === "taskInput") {
      taskInputRef.current.focus();
    } else if (focusedButton === "taskInputBlur") {
      taskInputRef.current.blur();
    } else if (focusedButton === "escapeAll") {
      taskInputRef.current.blur();
      addButtonRef.current.blur();
      letsGoButtonRef.current.blur();
    }
  }, [focusedButton]);

  useEffect(() => {
    //console.log("compareToTask ", compareToTask);
  }, [compareToTask, compareToIndex]);

  useEffect(() => {
    console.log("ties ", ties);
  }, [ties]);

  useEffect(() => {
    console.log("priorities ", priorities);
  }, [priorities]);

  useEffect(() => {
    console.log("winnerCount is ", winnerCount);
    let priorities = new Object(
      [...winnerCount.entries()].sort((a, b) => b[1] - a[1])
    );
    setPriorities(priorities);
    // (currentIndex == taskList.length - 2)
    // recalculating every time match added is inefficient but maybe necessary
    let existingTies = getDupes([...winnerCount.entries()]);
    setTies(existingTies);
  }, [winnerCount]);

  function handleTie(e) {
    let currentWinnerCount = new Map(winnerCount); // should return a number of won matches

    currentWinnerCount.set(
      e.target.value,
      currentWinnerCount.get(e.target.value) - 1
    );
    // minus to subtract order. if there are multiple subsets of dupes,
    // then 1 is the wrong number to use. need to get the number of points
    // between the tied value and the next largest value divided by the number
    // of tied items in the subset
    setWinnerCount(currentWinnerCount);
  }

  function createTasks() {
    const initialTasks = [];
    for (let i = 0; i < taskList.length; i++) {
      initialTasks.push(taskList[i]);
    }
    localStorage.setItem("tasks", initialTasks);
    setIsPrioritizing(true);
  }

  function handleChoice(e) {
    let comparisonTasksList = [currentTask, compareToTask];
    let winnerIndex = comparisonTasksList.indexOf(e.target.value);
    let comparisonTasksToWinnerMap = new Map([
      [comparisonTasksList, winnerIndex],
    ]);
    if (matches.size == 0) {
      // if matches not set, set the value to an array of choices and the winner
      let winnerMap = new Map([[e.target.value, 1]]);
      setWinnerCount(winnerMap);
      setCompareToIndex(compareToIndex + 1);
      setMatches(comparisonTasksToWinnerMap);
    } else {
      // matches is set, push the new winner Map to matches
      let currentMatches = new Map(matches); // clones shallowly
      currentMatches.set(comparisonTasksList, winnerIndex);
      let currentWinnerCount = new Map(winnerCount); // should return a number of won matches

      currentWinnerCount.set(
        e.target.value,
        currentWinnerCount.get(e.target.value) + 1 || 1
      );
      setWinnerCount(currentWinnerCount);
      setCompareToIndex(compareToIndex + 1);
      setMatches(currentMatches);
    }
    if (compareToIndex == taskList.length - 1) {
      //console.log("compare is at length end");
      setCurrentIndex(currentIndex + 1);
      setCompareToIndex(currentIndex + 2);
    }
    // if (currentIndex == taskList.length - 2) {
    //   // console.log("current is at length end");
    //   // console.log(
    //   //   "samesies",
    //   //   [...winnerCount.entries()].sort((a, b) => b[1] == a[1])
    //   // );
    // }
  }

  const addTaskComponent = (
    <>
      <div className="text-center py-8">
        <h1 className="text-3xl font-sans font-bold">Brain Dump</h1>
        <h2 className="text-xl font-sans text-slate-500	">
          what&apos;s on your mind?
        </h2>
      </div>
      <div className="flex justify-center text-center">
        <div className="bg-white justify-center items-center p-0 gap-4 relative">
          <input
            tabindex="0"
            ref={taskInputRef}
            className="text-wrap text-xl box-border items-center p-2 m-4 left-0 top-0 bg-white border border-gray-300 shadow-sm rounded-lg"
            data-testid="task-input"
            value={text}
            placeholder="Meditate"
            onChange={(e) => setText(e.target.value)}
            onMouseEnter={() => setFocusedButton("taskInput")}
            onMouseLeave={() => setFocusedButton("taskInputBlur")}
          />
          <button
            tabindex="0"
            ref={addButtonRef}
            className="text-xl text-black p-2 m-0.5 justify-center items-center gap-2 top-0 bg-white text-black hover:bg-black hover:text-white border-2 border-black focus:bg-black focus:text-white rounded-lg"
            data-testid="task-button"
            onClick={() => {
              taskList.push(text);
              setText("");
              setTaskList([...taskList]);
            }}
            onMouseEnter={() => setFocusedButton("addTask")}
            onMouseLeave={() => setFocusedButton("addTaskBlur")}
          >
            Add Task
          </button>
          <button
            tabindex="0"
            ref={letsGoButtonRef}
            className="text-xl text-black p-2 m-0.5 justify-center bg-white bg-white text-black hover:bg-black hover:text-white border-2 border-black focus:bg-black focus:text-white rounded-lg"
            data-testid="prioritize-button"
            onClick={createTasks}
            onMouseEnter={() => setFocusedButton("letsGo")}
            onMouseLeave={() => setFocusedButton("letsGoBlur")}
          >
            Let&apos;s go!
          </button>
        </div>
        <ul
          className="inline-block flex-row p-2 overflow-y-auto"
          data-testid="task-list"
        >
          {taskList.map((item, idx) => (
            <li
              key={idx}
              className="p-2 font-mono text-xl text-gray-800 box-border py-[10px] gap-5 border border-gray-300 rounded"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const compareComponent = (
    <>
      <div className="text-center py-8">
        <h1 className="text-3xl font-sans font-bold">Pick one</h1>
        <h4 className="font-sans text-slate-500">
          what task would you rather get done first?
        </h4>
      </div>
      <div class="block grid grid-cols-2 p-2">
        <button
          className="text-xl text-white bg-black shadow-sm rounded-lg p-2 m-2"
          data-testid="choice1-button"
          onClick={handleChoice}
          value={currentTask}
        >
          {currentTask}
        </button>
        <button
          className="text-xl text-white bg-black shadow-sm rounded-lg p-2 m-2"
          data-testid="choice2-button"
          onClick={handleChoice}
          value={compareToTask}
        >
          {compareToTask}
        </button>
      </div>
    </>
  );

  const tiedComponent = ties ? (
    <>
      <div className="text-center py-8">
        <h1 className="text-3xl font-sans font-bold">Dump it</h1>
        <h2 className="text-xl font-sans text-slate-500">
          gotta prioritize somehow... dump a task. <br></br>your brain will
          thank you.
        </h2>
        <div className="inline-block flex-row p-2 overflow-y-auto">
          <ul>
            {Object.values(ties).map((item, idx) =>
              Object.values(item).map((i, id) => (
                <li key={id}>
                  <button
                    className="text-xl text-white bg-black shadow-sm rounded-lg p-2 m-2 hover:bg-red-600"
                    data-testid={"dump-button-" + i[0]}
                    onClick={handleTie}
                    value={i}
                  >
                    dump {i}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  ) : (
    <>no ties</>
  );
  const prioritiesArray = [];

  priorities.length > 0
    ? priorities.forEach((item, i) =>
        prioritiesArray.push(
          <ol className="text-xl text-gray-500 my-1 p-1" key={i}>
            {item}
          </ol>
        )
      )
    : null;

  const resultsComponent = (
    <>
      <div className="text-center py-8">
        <h1 className="text-xl font-sans font-bold">
          here&apos;s your brain dump, prioritized
        </h1>
        <div className="table w-full">{prioritiesArray}</div>
      </div>
    </>
  );

  return isPrioritizing
    ? currentIndex < taskList.length - 1
      ? compareComponent
      : ties
      ? tiedComponent
      : resultsComponent
    : addTaskComponent;
}
