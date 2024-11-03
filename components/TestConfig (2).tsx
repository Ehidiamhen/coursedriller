'use client'

import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../utils/api'

export default function TestConfig() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [questionType, setQuestionType] = useState('mcq')
  const [numQuestions, setNumQuestions] = useState(10)
  const [duration, setDuration] = useState(30)
  const [difficulty, setDifficulty] = useState('medium')
  const history = useHistory()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/api/test/generate', {
        courseId: selectedCourse,
        questionType,
        numQuestions,
        duration,
        difficulty,
      })
      history.push(`/test-taking/${response.data.testId}`)
    } catch (error) {
      console.error('Error generating test:', error)
      alert('Failed to generate test. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configure Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up your test parameters.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="course" className="sr-only">
                Course
              </label>
              <select
                id="course"
                name="course"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="questionType" className="sr-only">
                Question Type
              </label>
              <select
                id="questionType"
                name="questionType"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="essay">Essay</option>
                <option value="obj">Objective</option>
              </select>
            </div>
            <div>
              <label htmlFor="numQuestions" className="sr-only">
                Number of Questions
              </label>
              <input
                id="numQuestions"
                name="numQuestions"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Number of Questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label htmlFor="duration" className="sr-only">
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="sr-only">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Test
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}