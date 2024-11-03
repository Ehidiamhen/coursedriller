'use client'

import { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import api from '../utils/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TestTaking() {
  const [test, setTest] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const { testId } = useParams()
  const history = useHistory()

  useEffect(() => {
    fetchTest()
  }, [])

  useEffect(() => {
    if (test) {
      setTimeLeft(test.duration * 60)
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            submitTest()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [test])

  const fetchTest = async () => {
    try {
      const response = await api.get(`/api/test/${testId}`)
      setTest(response.data)
      setAnswers(new Array(response.data.questions.length).fill(''))
    } catch (error) {
      console.error('Error fetching test:', error)
      alert('Failed to fetch test. Please try again.')
    }
  }

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitTest = async () => {
    try {
      await api.post(`/api/test/${testId}/submit`, { answers })
      history.push(`/summary/${testId}`)
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Failed to submit test. Please try again.')
    }
  }

  if (!test) return <div>Loading...</div>

  const question = test.questions[currentQuestion]

  return (
    <Card className="w-[600px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>{test.course.title} - Test</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {test.questions.length} | Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">{question.question}</div>
        {question.type === 'mcq' && (
          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {question.type === 'essay' && (
          <Textarea
            value={answers[currentQuestion]}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer here"
            className="w-full h-32"
          />
        )}
        {question.type === 'obj' && (
          <input
            type="text"
            value={answers[currentQuestion]}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer here"
            className="w-full p-2 border rounded"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</Button>
        {currentQuestion < test.questions.length - 1 ? (
          <Button onClick={nextQuestion}>Next</Button>
        ) : (
          <Button onClick={submitTest}>Submit Test</Button>
        )}
      </CardFooter>
    </Card>
  )
}