"use client";
import "./globals.css"; // Import your styles
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import { useKeyPress } from "./useKeyPress";

function calculateUniquePairs(n) {
  if (n < 2) {
    return 0; // There are no pairs if there are less than 2 elements
  }
  return (n * (n - 1)) / 2;
}

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
  const [focusedButton, setFocusedButton] = useState("taskInput");
  const [combos, setCombos] = useState(0);
  const [min, setMin] = useState(null);
  const [unchosenTasks, setUnchosenTasks] = useState([]);

  const addButtonRef = useRef(null);
  const letsGoButtonRef = useRef(null);
  const taskInputRef = useRef(null);

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];

  const onKeyPress = (event) => {
    if (event.key === "Enter" && focusedButton === "taskInput" && text) {
      taskList.push(text);
      setText("");
      setTaskList([...taskList]);
    }
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

  useKeyPress(["ArrowLeft", "ArrowRight", "Escape", "Enter"], onKeyPress);

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
    taskInputRef.current.focus();
  }, [taskList]);

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
    console.log("min ", min);
  }, [min]);

  useEffect(() => {
    console.log("winnerCount is ", winnerCount);
    let tasks = localStorage.getItem("tasks")
      ? localStorage.getItem("tasks").split(",")
      : undefined;
    let unchosenTasksList = new Array();
    if (tasks) {
      tasks.forEach((element) => {
        console.log({ element });
        let taskVotes = winnerCount.get(element);

        if (!taskVotes) {
          unchosenTasksList.push(element);
          console.log({ unchosenTasks });
          setUnchosenTasks(unchosenTasksList);
          if (min > 0) {
            setMin(0);
          }
        } else {
          if (min == undefined) {
            setMin(taskVotes);
          }
        }
        if (taskVotes && taskVotes < min) {
          setMin(taskVotes); // update new minimum
        }
      });

      let priorities = new Object(
        [...winnerCount.entries()].sort((a, b) => b[1] - a[1])
      );
      setPriorities(priorities);
      // (currentIndex == taskList.length - 2)
      // recalculating every time match added is inefficient but maybe necessary
      let existingTies = getDupes([...winnerCount.entries()]);
      setTies(existingTies);
    }
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
    // TODO
    // need to get new min val and reset the unchosen task to the min val - 1
  }

  function createTasks() {
    const initialTasks = [];
    for (let i = 0; i < taskList.length; i++) {
      initialTasks.push(taskList[i]);
    }
    localStorage.setItem("tasks", initialTasks);
    setIsPrioritizing(true);
    let n = calculateUniquePairs(initialTasks.length);
    setCombos(n);
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
      console.log("before setting min", currentWinnerCount);

      if (matches.size == combos - 1) {
        console.log({ currentWinnerCount });

        unchosenTasks.forEach((element) => {
          currentWinnerCount.set(element, min - 1);
        });
      }
      console.log("after setting min", currentWinnerCount);

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

  function Footer() {
    return (
      <footer>
        <a
          style={{ display: "block", width: "200px" }}
          href="https://www.buymeacoffee.com/liano"
          target="_blank"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png"
            alt="Buy Me A Coffee"
            width={200}
            height={60}
          />
        </a>
        <a href="https://discord.gg/KFUXh9CsQ4" target="_blank">
          <button
            className="text-xl font-semibold text-black p-2 m-0.5 justify-center items-center gap-2 top-0 bg-lime-400	 rounded-lg"
            alt="Community"
            width={200}
            height={60}
          >
            Give Feedback
          </button>
        </a>
      </footer>
    );
  }

  const addTaskComponent = (
    <>
      <div className="text-center py-8 ">
        <h1 className="text-3xl font-sans font-bold">Brain Dump</h1>
        <h2 className="text-xl font-sans text-slate-500 dark:text-slate-400">
          what&apos;s on your mind?
        </h2>
      </div>
      <div className="flex justify-center text-center dark:bg-black">
        <div className="bg-white dark:bg-black justify-center items-center p-0 gap-4 relative">
          <input
            ref={taskInputRef}
            className="text-wrap text-md md:text-xl placeholder-blue-600 dark:placeholder-blue-300 dark:enabled:text-blue-300 enabled:text-blue-600 dark:enabled:bg-slate-800 items-center p-2 m-4 left-0 top-0 dark:bg-slate-800 bg-white rounded-lg"
            data-testid="task-input"
            value={text}
            placeholder="Type here..."
            onChange={(e) => setText(e.target.value)}
          />
          <button
            ref={addButtonRef}
            className="text-md md:text-xl dark:disabled:bg-slate-800 disabled:text-zinc-400 enabled:bg-blue-700 enabled:text-white dark:disabled:text-gray-500 disabled:bg-neutral-200 dark:enabled:text-slate-800 p-2 m-0.5 justify-center items-center gap-2 top-0 dark:enabled:bg-blue-400 dark:enabled:hover:bg-blue-300 dark:enabled:border-blue-300 enabled:focus:bg-blue-300 rounded-lg"
            data-testid="task-button"
            onClick={() => {
              taskList.push(text);
              setText("");
              setFocusedButton("taskInput");
              setTaskList([...taskList]);
            }}
            disabled={text.length < 1}
          >
            Add Task
          </button>

          {/* <div className="group relative w-max mt-3.5"> */}
          <button
            ref={letsGoButtonRef}
            className="dark:disabled:bg-slate-800 disabled:text-zinc-400 enabled:bg-blue-700 enabled:text-white dark:disabled:text-gray-500 disabled:bg-neutral-200 text-md md:text-xl dark:enabled:text-slate-800 p-2 m-0.5 justify-center items-center gap-2 top-0 dark:enabled:bg-blue-400 dark:enabled:hover:bg-blue-300 dark:enabled:border-blue-300 enabled:focus:bg-blue-300 rounded-lg"
            data-testid="prioritize-button"
            onClick={createTasks}
            disabled={taskList.length < 3}
          >
            Continue
          </button>
        </div>
      </div>
      <ul className="flex-col list-none text-center" data-testid="task-list">
        {taskList.map((item, idx) => (
          <li
            key={idx}
            className="p-2 font-mono text-md md:text-xl dark:text-blue-300 text-blue-600 py-[10px] gap-5 rounded"
          >
            {item}
          </li>
        ))}
      </ul>
      {/* <div className="font-mono pointer-events-none fixed -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0">
            Click here once you are done adding tasks to the list.
          </div> */}
      <Footer />
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
      <div className="block grid grid-cols-2 p-2">
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
      <Footer />
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
      <Footer />
    </>
  ) : (
    <>no ties</>
  );
  const prioritiesArray = [];

  priorities.length > 0
    ? priorities.forEach((item, i) =>
        prioritiesArray.push(
          <ol
            className="text-xl dark:text-blue-300 text-blue-600 my-1 p-1"
            key={i}
          >
            {item[0]}
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
        <div data-testid="results" className="table w-full">
          {prioritiesArray}
        </div>
      </div>
      <Footer />
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
