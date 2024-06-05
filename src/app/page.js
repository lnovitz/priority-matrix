'use client'

import { useState } from 'react';


export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareToIndex, setCompareToIndex] = useState(1);
  const [matches, setMatches] = useState(new Map)

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[compareToIndex];
  console.log(currentTask);
  console.log(compareToTask);

  console.log("length ", taskList.length)

  function createTasks() {
    const initialTasks = [];
    for (let i = 0; i < taskList.length; i++) {
      initialTasks.push(taskList[i]);
    }
    console.log({initialTasks});
    localStorage.setItem("tasks", initialTasks);
    setIsPrioritizing(true);
  }

  function handleChoice(e) {
    console.log("testing", e.target.value)
    let match = [currentTask, compareToTask]
    console.log(typeof matches)
    console.log({matches})
    let winnerIndex = match.indexOf(e.target.value);
    let newMatch = new Map([[match, winnerIndex]]);
    //console.log({newMatch})
    if (matches.size == 0) {
      console.log("matches size 0")
      // console.log("before ", matches)
      console.log("newMatch ", newMatch)
      console.log("newMatch.get(match) ", newMatch.get(match))
      // console.log("e, ", e.target.value)
      setMatches(newMatch)
      setCompareToIndex(compareToIndex+1)

    } else {
      console.log("before ", matches)
      let currentMatches = new Map(matches)
      currentMatches.set(newMatch.get(match))
      setMatches(currentMatches)
      setCompareToIndex(compareToIndex+1)
      console.log("after ", matches)
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

  const resultsComponent = (<>sorted brain dump</>);

  return isPrioritizing ? (compareToTask ? compareComponent : resultsComponent) : addTaskComponent;
}
