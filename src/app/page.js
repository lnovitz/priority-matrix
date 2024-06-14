"use client";

import { useState, useEffect } from "react";

export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareToIndex, setCompareToIndex] = useState(currentIndex + 1);
  const [matches, setMatches] = useState(new Map());
  const [winnerCount, setWinnerCount] = useState(new Map());
  const [priorities, setPriorities] = useState({});

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];

  useEffect(() => {
    console.log("compareToTask ", compareToTask);
  }, [compareToTask, compareToIndex]);

  useEffect(() => {
    console.log("winnerCount is ", winnerCount);
    let priorities = new Object(
      [...winnerCount.entries()].sort((a, b) => b[1] - a[1])
    );
    setPriorities(priorities);
  }, [winnerCount]);

  useEffect(() => {}, [matches]);

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
      console.log("compare is at length end");
      setCurrentIndex(currentIndex + 1);
      setCompareToIndex(currentIndex + 2);
    }
    if (currentIndex == taskList.length - 2) {
      console.log("current is at length end");
      setIsPrioritizing(false);
    }
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

  const resultsComponent = <>{priorities}</>;

  return isPrioritizing
    ? currentIndex < taskList.length - 2
      ? compareComponent
      : resultsComponent
    : addTaskComponent;
}
