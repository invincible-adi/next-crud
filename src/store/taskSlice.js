import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchTasks = createAsyncThunk('task/fetchTasks', async (token, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/task', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.tasks;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const addTask = createAsyncThunk('task/addTask', async ({ task, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.message;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const editTask = createAsyncThunk('task/editTask', async ({ task, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/task', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.message;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteTask = createAsyncThunk('task/deleteTask', async ({ id, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/task', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const taskSlice = createSlice({
    name: 'task',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearTaskMessage: (state) => {
            state.message = null;
        },
        clearTaskError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Edit
            .addCase(editTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTask.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(editTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTaskMessage, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer; 