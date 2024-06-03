'use client'

import { useState } from 'react';
export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);    
  
  function handleClick() {
    alert('you clicked me omg')
  }

  return (
    <>
    <h1>Brain Dump Sort</h1>
    <div >what's on your mind?</div>
    <button onClick={handleClick}>Add Task</button>
    </>
  );
  }
