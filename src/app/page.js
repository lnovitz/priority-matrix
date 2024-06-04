'use client'

import { useState } from 'react';


export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareToIndex, setCompareToIndex] = useState(0);
  const [matches, setMatches] = useState(new Map)

  const currentTask = taskList[currentIndex];
  const compareToTask = taskList[currentIndex+1];
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
    <div>{currentTask}</div>
    <div>{compareToTask}</div>
    </>
  );

  return isPrioritizing ? compareComponent : addTaskComponent;
}
