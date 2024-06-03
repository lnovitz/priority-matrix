'use client'
import { useState } from 'react';

export default function Form() {
    const [taskCount, setTaskCount] = useState(null);
    const [currentTask, setCurrentTask] = useState(0)
    const [tasks, setTasks] = useState(["wash dishes", "wash hair", "clean tub"])


    const savedTasks = ["wash dishes", "wash hair", "clean tub"]//JSON.parse(localStorage.getItem("tasks"));
    const numTasks = savedTasks.length
    console.log(numTasks)
    console.log({savedTasks})
    for (let i in savedTasks) {
      console.log(savedTasks[i])
      let a = savedTasks[i]

      let savedTasksMinusCurrent = [...savedTasks].splice(i+1);
      console.log({savedTasksMinusCurrent})
      for (let j in savedTasksMinusCurrent) {
        console.log(savedTasksMinusCurrent[j])
        let b = savedTasksMinusCurrent[j]
        things.push(`<input>{a} vs {b}</input>`)
      }
    }  

    



    
// Object.keys(tasks).forEach((value) => {
//   let val = tasks[value];
//   return (<input>{val}</input>)
// }
// )

    // for (let i in decoded_tasks) {
    //     console.log(typeof decoded_tasks[i])
    //     let task_value = decoded_tasks[i]
    //     return (<input>{{task_value}}</input>)
    // }
    // return (<h2>Prioritize Your Tasks</h2>)
}