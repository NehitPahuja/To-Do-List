const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const { PORT = 5000, MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

app.get(
  '/api/tasks',
  asyncHandler(async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  })
);

app.post(
  '/api/tasks',
  asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const task = await Task.create({ title: title.trim() });
    res.status(201).json(task);
  })
);

app.patch(
  '/api/tasks/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = {};

    if ('title' in req.body) {
      const { title } = req.body;
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Title must be a non-empty string.' });
      }
      updates.title = title.trim();
    }

    if ('completed' in req.body) {
      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean.' });
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
  })
);

app.delete(
  '/api/tasks/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(204).send();
  })
);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Invalid identifier.' });
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
