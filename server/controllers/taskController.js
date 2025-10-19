import Task from "../models/task.js";

// Helper function to generate taskId in format DDMMYYYY-NNN
const generateTaskId = async (userId) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    // Create the date prefix (DDMMYYYY)
    const datePrefix = `${day}${month}${year}`;
    
    // Find all tasks with this date prefix for this user
    // Using regex to match taskIds that start with the date prefix
    const existingTasks = await Task.find({
        user: userId,
        taskId: { $regex: `^${datePrefix}-` }
    }).select('taskId').lean();
    
    // Extract the numbers from existing taskIds and find the highest
    let maxNumber = 0;
    existingTasks.forEach(task => {
        // Extract the number part after the last hyphen
        const parts = task.taskId.split('-');
        const number = parseInt(parts[parts.length - 1], 10);
        if (number > maxNumber) {
            maxNumber = number;
        }
    });
    
    // Increment by 1 to get the next available number
    const taskNumber = String(maxNumber + 1).padStart(3, '0');
    
    return `${datePrefix}-${taskNumber}`;
};

export const createTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        
        if (!title || !description || !deadline) {
            return res.status(400).json({ success: false, message: "Title, description, and deadline are required" });
        }

        // Generate unique taskId
        const taskId = await generateTaskId(req.user._id);

        const newTask = await Task.create({
            taskId,
            title,
            description,
            deadline,
            user: req.user._id,
            status: "pending"
        });

        res.status(201).json({ success: true, task: newTask, message: "Task created successfully" });
    } catch (error) {
        console.log("Error creating task:", error.message);
        
        // If duplicate key error on taskId, provide more specific error
        if (error.code === 11000 && error.keyPattern?.taskId) {
            return res.status(409).json({ success: false, message: "Task ID conflict. Please try again." });
        }
        
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) {
        console.log("Error fetching tasks:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const task = await Task.findOne({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.status = status;
        
        // Set completedAt when task is marked as completed
        if (status === "completed" && !task.completedAt) {
            task.completedAt = new Date();
        }
        
        // Clear completedAt if task is moved back from completed status
        if (status !== "completed" && task.completedAt) {
            task.completedAt = null;
        }
        
        await task.save();

        res.json({ success: true, task, message: "Task status updated successfully" });
    } catch (error) {
        console.log("Error updating task:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error deleting task:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
