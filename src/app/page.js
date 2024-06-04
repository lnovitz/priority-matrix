'use client'

import { useState } from 'react';


export default function BrainDump() {
  const [taskList, setTaskList] = useState([]);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTaskList([{
          id: taskList.length,
          text: text
        }, ...taskList]);
      }}>Add</button>
      <ul>
        {taskList.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
