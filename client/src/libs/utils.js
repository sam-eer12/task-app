export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(date) {
    return new Date(date).toLocaleString("en-US", { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
    });
}

export function calculateCompletionScore(createdAt, deadline, completedAt) {
    if (!completedAt) return null;
    
    const created = new Date(createdAt).getTime();
    const dead = new Date(deadline).getTime();
    const completed = new Date(completedAt).getTime();
    
    // Total time allocated (deadline - created)
    const totalTime = dead - created;
    
    // Time actually taken (completed - created)
    const timeTaken = completed - created;
    
    // Calculate percentage
    const percentage = ((totalTime - timeTaken) / totalTime) * 100;
    
    return {
        percentage: Math.round(percentage),
        isEarly: completed < dead,
        timeStatus: completed < dead ? 'early' : 'late',
        daysEarly: Math.abs(Math.round((dead - completed) / (1000 * 60 * 60 * 24)))
    };
}