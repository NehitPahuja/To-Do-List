const BASE_URL = 'http://localhost:5000/api/tasks';

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchTasks = async () => {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
};

export const createTask = async (title) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  return handleResponse(response);
};

export const updateTask = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
};

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// Usage example:
// (async () => {
//   const newTask = await createTask('Write documentation');
//   console.log('Created', newTask);
//
//   const tasks = await fetchTasks();
//   console.log('Tasks', tasks);
//
//   const updatedTask = await updateTask(newTask._id, { completed: true });
//   console.log('Updated', updatedTask);
//
//   await deleteTask(newTask._id);
//   console.log('Deleted task');
// })();
