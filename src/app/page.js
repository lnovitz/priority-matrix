'use client'

import { useState, useEffect } from 'react';


export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareToIndex, setCompareToIndex] = useState(1);
  const [matches, setMatches] = useState(new Map)
  const [winnerCount, setWinnerCount] = useState(new Map)
  const [priorities, setPriorities] = useState({})

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];

  useEffect(() => {
    console.log("winnerCount is ", winnerCount)
    let priorities = new Object([...winnerCount.entries()].sort((a, b) => b[1] - a[1]));
    setPriorities(priorities)
  }, [winnerCount]);

  useEffect(() => {

  }, [matches]);

  // console.log(currentTask);
  // console.log(compareToTask);
  // console.log("object.netries", Object.entries(winnerCount))

  // console.log("length ", taskList.length)

  function createTasks() {
    const initialTasks = [];
    for (let i = 0; i < taskList.length; i++) {
      initialTasks.push(taskList[i]);
    }
    //console.log({initialTasks});
    localStorage.setItem("tasks", initialTasks);
    setIsPrioritizing(true);
  }



  function handleChoice(e) {
    let comparisonTasksList = [currentTask, compareToTask];
    let winnerIndex = comparisonTasksList.indexOf(e.target.value);
    let comparisonTasksToWinnerMap = new Map([[comparisonTasksList, winnerIndex]]);
    //console.log({matches})
    if (matches.size == 0) {
      // if matches not set, set the value to an array of choices and the winner
      let winnerMap = new Map([[e.target.value, 1]]);
      setWinnerCount(winnerMap);

      setCompareToIndex(compareToIndex+1);

      setMatches(comparisonTasksToWinnerMap);

    } else {
      // matches is set, push the new winner Map to matches
      let currentMatches = new Map(matches); // clones shallowly
      currentMatches.set(comparisonTasksList, winnerIndex)
      //console.log({currentMatches})
      let currentWinnerCount =  new Map(winnerCount); // should return a number of won matches
      //console.log({currentWinnerCount});
      //console.log({winnerCount});
      currentWinnerCount.set(e.target.value, currentWinnerCount.get(e.target.value) + 1 || 1); // not sure if this works
      setWinnerCount(currentWinnerCount);
      //console.log({winnerCount});
      setCompareToIndex(compareToIndex+1);
      setMatches(currentMatches);
      //console.log({priorities})
    }

  }

  const addTaskComponent = (
    <>
      <button onClick={createTasks}>Done, let's prioritize</button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        taskList.push(text)
        setText('');
        setTaskList([...taskList]);
      }}>Add</button>
      <ul>
        {taskList.map((item, idx) => (
          <li key={idx}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );

  const compareComponent = (
    <>
    <h1>what task would you rather get done first?</h1>
    <button onClick={handleChoice} value={currentTask}>Choose {currentTask}</button>
    <br></br>
    <button onClick={handleChoice} value={compareToTask}>Choose {compareToTask}</button>
    </>
  );

  const resultsComponent = (<>{priorities}</>);

  return isPrioritizing ? (compareToTask ? compareComponent : resultsComponent) : addTaskComponent;
}
