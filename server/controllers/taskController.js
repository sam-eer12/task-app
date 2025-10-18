import Task from "../models/task.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        
        if (!title || !description || !deadline) {
            return res.status(400).json({ success: false, message: "Title, description, and deadline are required" });
        }

        const newTask = await Task.create({
            title,
            description,
            deadline,
            user: req.user._id,
            status: "pending"
        });

        res.status(201).json({ success: true, task: newTask, message: "Task created successfully" });
    } catch (error) {
        console.log("Error creating task:", error.message);
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
