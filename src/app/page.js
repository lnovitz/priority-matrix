'use client'

import { useState } from 'react';
export default function Form() {
  const [formData, setFormData] = useState({task1:"", task2:"", task3:"", task4:"", task5:"", task6:"", task7:"", task8:"", task9:"", task10:""});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <h2>Prioritize Your Tasks</h2>
      
      <form onSubmit={handleSubmit}>
        <p>
          Task 1
        </p>
        <textarea
          value={formData.task1}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task1"
        />
        <p>
          Task 2
        </p>
        <textarea
          value={formData.task2}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task2"
        />
        <p>
          Task 3
        </p>
        <textarea
          value={formData.task3}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task3"
        />
        <p>
          Task 4
        </p>
        <textarea
          value={formData.task4}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task4"
        />
        <p>
          Task 5
        </p>
        <textarea
          value={formData.task5}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task5"
        />
        <p>
          Task 6
        </p>
        <textarea
          value={formData.task6}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task6"
        />
        <p>
          Task 7
        </p>
        <textarea
          value={formData.task7}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task7"
        />
        <p>
          Task 8
        </p>
        <textarea
          value={formData.task8}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task8"
        />
        <p>
          Task 9
        </p>
        <textarea
          value={formData.task9}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task9"
        />
        <p>
          Task 10
        </p>
        <textarea
          value={formData.task10}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          name="task10"
        />
        <br />
        <button type="submit" disabled={
          formData.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
  }
