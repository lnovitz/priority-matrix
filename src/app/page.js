"use client";
import "./globals.css"; // Import your styles

import { useState, useEffect } from "react";

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

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];

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
      <div class="container mx-auto ">
        <div class="flex items-center">
          <input
            class="underline decoration-dotted 
            appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            data-testid="task-input"
            value={text}
            placeholder="Clean the windows"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            data-testid="task-button"
            onClick={() => {
              taskList.push(text);
              setText("");
              setTaskList([...taskList]);
            }}
          >
            Add Task
          </button>
          <button
            class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            data-testid="prioritize-button"
            onClick={createTasks}
          >
            Done, let&apos;s prioritize
          </button>
          <ul data-testid="task-list">
            {taskList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  const compareComponent = (
    <>
      <h1>what task would you rather get done first?</h1>
      <button
        data-testid="choice1-button"
        onClick={handleChoice}
        value={currentTask}
      >
        Choose {currentTask}
      </button>
      <br></br>
      <button
        data-testid="choice2-button"
        onClick={handleChoice}
        value={compareToTask}
      >
        Choose {compareToTask}
      </button>
    </>
  );

  const tiedComponent = ties ? (
    <>
      <h1>
        gotta prioritize somehow... dump a task. your brain will thank you.
      </h1>
      <ul>
        {Object.values(ties).map((item, idx) =>
          Object.values(item).map((i, id) => (
            <li key={id}>
              <button
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
    </>
  ) : (
    <>no ties</>
  );
  const resultsComponent = (
    <>
      <div data-testid="results">{priorities}</div>
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
