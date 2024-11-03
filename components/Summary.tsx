'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

interface Question {
  question: string
  correctAnswer: string
  explanation?: string
}

interface Test {
  course: {
    title: string
  }
  score: number
  difficulty: string
  duration: number
  questions: Question[]
  userAnswers: string[]
}

export default function Summary() {
  const [test, setTest] = useState<Test | null>(null)
  const { testId } = useParams<{ testId: string }>()

  useEffect(() => {
    fetchTestResults()
  }, [])

  const fetchTestResults = async () => {
    try {
      const response = await api.get(`/api/test/${testId}/results`)
      setTest(response.data)
    } catch (error) {
      console.error('Error fetching test results:',    error)
      alert('Failed to fetch test results. Please try again.')
    }
  }

  if (!test) return <div className="text-center mt-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Test Summary
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {test.course.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Test results and explanations
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.score.toFixed(2)}%
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Difficulty</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.difficulty}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.duration} minutes
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {test.questions.map((question, index) => (
            <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Question {index + 1}
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Question</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {question.question}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Your Answer</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {test.userAnswers[index]}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Correct Answer</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {question.correctAnswer}
                    </dd>
                  </div>
                  {question.explanation && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Explanation</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {question.explanation}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}