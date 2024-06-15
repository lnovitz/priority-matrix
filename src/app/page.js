"use client";

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
  return duplicates;
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

  // useEffect(() => {
  //   console.log("ties ", ties);
  // }, [ties]);

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
    let dumpedValue = e.target.value;
    console.log(dumpedValue);
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
      <button onClick={createTasks}>Done, let's prioritize</button>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={() => {
          taskList.push(text);
          setText("");
          setTaskList([...taskList]);
        }}
      >
        Add
      </button>
      <ul>
        {taskList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </>
  );

  const compareComponent = (
    <>
      <h1>what task would you rather get done first?</h1>
      <button onClick={handleChoice} value={currentTask}>
        Choose {currentTask}
      </button>
      <br></br>
      <button onClick={handleChoice} value={compareToTask}>
        Choose {compareToTask}
      </button>
    </>
  );

  const tiedComponent = (
    <>
      <h1>
        gotta prioritize somehow... dump a task. your brain will thank you.
      </h1>
      <ul>
        {ties.map((item, idx) => (
          <li key={idx}>
            <button onClick={handleTie} value={item[0]}>
              dump {item[0]}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
  const resultsComponent = <>{priorities}</>;

  return isPrioritizing
    ? currentIndex < taskList.length - 1
      ? compareComponent
      : ties.length >= 3
      ? tiedComponent
      : resultsComponent
    : addTaskComponent;
}
