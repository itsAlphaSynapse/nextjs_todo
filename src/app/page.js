"use client"

import React, { useEffect, useState } from 'react';
import styles from './todo.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [fetchingTodos, setFetchingTodos] = useState(true);

  const router = useRouter();

  const fetchTasks = async () => {

    try {
      setFetchingTodos(true);
      const response = await axios.get('/api/todo');

      if (!response.data.success) {
        router.push('/login');
        return;
      }

      setFetchingTodos(false);
      setTasks(response.data.data.reverse());
    } catch (error) {
      console.error(error);
      alert('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [])

  const createTask = async () => {
    try {

      if (!newTask) {
        setError('Please provide a task');
        return;
      }

      setLoader(true)
      const response = await axios.post('/api/todo', {
        text: newTask,
        description: ''
      });
      setLoader(false)

      if (!response.data.success) {
        setError('Error creating task.');
        return;
      }

      setTasks([...tasks, response.data.data].reverse());
      setNewTask('');
      setError('');
    } catch (error) {
      console.error(error);
      setError('Error creating task.');
    }
  };


  const updateTask = async () => {
    try {
      const response = await axios.put(`/api/todo?id=${editingTaskId}`, {
        text: editedTaskText,
        description: editedTaskDescription
      });

      if (!response.data.success) {
        setError('Error updating task.');
        return;
      }

      fetchTasks();
      cancelEditingTask();

    } catch (error) {
      console.error(error);
      setError('Error updating task.');
    }
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditedTaskText('');
    setEditedTaskDescription('');
    setError('');
  };

  const removeTask = async (taskId) => {
    try {
      const response = await axios.delete(`/api/todo?id=${taskId}`);
      if (!response.data.success) {
        setError('Error removing task.');
        return;
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error(error);
      setError('Error removing task.');
    }
  };

  const toggleTask = async (taskId) => {

    const specificTodo = tasks.find(task => task.id === taskId);

    try {
      const response = await axios.patch(`/api/todo?id=${taskId}`, {
        done: !specificTodo.completed
      });

      if (!response.data.success) {
        setError('Error updating task.');
        return;
      }
    } catch (error) {
      console.error(error);
      setError('Error updating task.');
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };


  return (
    <div className={styles['todo-container']}>
      <h2>Todo App</h2>
      <div className={styles['add-task-container']}>
        <input
          type="text"
          className={styles['task-input']}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className={styles['add-button']} onClick={createTask} disabled={loader}>
          {
            loader ? "Loading..." : "Add"
          }
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <ul>
        {
          fetchingTodos ? <h3 style={{ textAlign: 'center' }}>Fetching Data...</h3> :
            tasks.map((task) => (
              <li key={task.id} className={`${styles['task-item']} ${task.completed ? styles.completed : ''}`}>
                <div className={styles['checkbox-container']}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                </div>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      className={styles['edit-input']}
                      value={editedTaskText}
                      onChange={(e) => setEditedTaskText(e.target.value)}
                      placeholder="Task name"
                    />
                    <input
                      type="text"
                      className={styles['edit-input']}
                      value={editedTaskDescription}
                      onChange={(e) => setEditedTaskDescription(e.target.value)}
                      placeholder="Task description"
                    />
                    <div>
                      <button className={styles['update-button']} onClick={updateTask}>
                        Update
                      </button>
                      <button className={styles['cancel-button']} onClick={cancelEditingTask}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles['task-text']}>
                      <p>{task.text}</p>
                      {task.description && <p className={styles.description}>{task.description}</p>}
                    </div>
                    <div>
                      <button className={styles['remove-button']} onClick={() => removeTask(task.id)}>
                        Remove
                      </button>
                      <button className={styles['remove-button']} onClick={() => { setEditingTaskId(task.id), setEditedTaskText(task.text), setEditedTaskDescription(task.description) }}>
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
        }
      </ul>
    </div>
  );
};

export default Todo;
