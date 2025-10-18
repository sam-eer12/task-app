import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { formatDateTime, formatDate, calculateCompletionScore } from '../libs/utils'

const Home = () => {
  const { authUser, logout, axios } = useContext(AuthContext)
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!authUser) {
      navigate('/login')
    } else {
      fetchTasks()
    }
  }, [authUser, navigate])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get('/api/tasks')
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/tasks', newTask)
      if (data.success) {
        setTasks([data.task, ...tasks])
        setNewTask({ title: '', description: '', deadline: '' })
        setShowModal(false)
        toast.success('Task created successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create task')
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/tasks/${taskId}`, { status: newStatus })
      if (data.success) {
        setTasks(tasks.map(task => task._id === taskId ? data.task : task))
        toast.success('Task status updated')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      const { data } = await axios.delete(`/api/tasks/${taskId}`)
      if (data.success) {
        setTasks(tasks.filter(task => task._id !== taskId))
        toast.success('Task deleted successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!authUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome, {authUser?.fullName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending ({tasks.filter(t => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              In Progress ({tasks.filter(t => t.status === 'in-progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg"
          >
            + New Task
          </button>
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No tasks found</p>
            <p className="text-gray-500 mt-2">Create your first task to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => {
              const completionScore = calculateCompletionScore(task.createdAt, task.deadline, task.completedAt);
              
              return (
              <div key={task._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1">{task.title}</h3>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                
                {/* Date Information */}
                <div className="mb-3 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Created: {formatDateTime(task.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={new Date(task.deadline) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                      Deadline: {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>

                {/* Completion Score */}
                {completionScore && (
                  <div className={`mb-3 p-3 rounded-lg ${completionScore.isEarly ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      {completionScore.isEarly ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${completionScore.isEarly ? 'text-green-700' : 'text-red-700'}`}>
                          Completed {completionScore.daysEarly} day{completionScore.daysEarly !== 1 ? 's' : ''} {completionScore.timeStatus}!
                        </p>
                        <p className={`text-xs ${completionScore.isEarly ? 'text-green-600' : 'text-red-600'}`}>
                          Score: {completionScore.isEarly ? '+' : ''}{completionScore.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {task.status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'pending')}
                      className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm"
                    >
                      Pending
                    </button>
                  )}
                  {task.status !== 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'completed')}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter task description"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
