'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CourseDriller() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('upload')

  if (!isLoggedIn) {
    return <AuthComponent onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">COURSEDRILLER</h1>
      <Tabs value={currentView} onValueChange={setCurrentView}>
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="test">Take Test</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <UploadComponent />
        </TabsContent>
        <TabsContent value="test">
          <TestComponent />
        </TabsContent>
        <TabsContent value="summary">
          <SummaryComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AuthComponent({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
        <CardDescription>Enter your details to {isSignUp ? 'create an account' : 'login'}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full" onClick={onLogin}>{isSignUp ? 'Sign Up' : 'Login'}</Button>
        <Button variant="link" className="mt-2" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function UploadComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Course Materials</CardTitle>
        <CardDescription>Upload your course materials in PDF, PowerPoint, Word, or JPEG format.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Course Material</Label>
          <Input id="picture" type="file" multiple />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Upload</Button>
      </CardFooter>
    </Card>
  )
}

function TestComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Take a Test</CardTitle>
        <CardDescription>Configure your test settings and start the exam.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="questionType">Question Type</Label>
              <Select>
                <SelectTrigger id="questionType">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="obj">Objective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Input id="numQuestions" type="number" placeholder="Enter number of questions" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="Enter test duration" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Start Test</Button>
      </CardFooter>
    </Card>
  )
}

function SummaryComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Summary</CardTitle>
        <CardDescription>Review your test results and explanations.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your score: 80%</p>
        <p>Correct answers: 8/10</p>
        {/* Add more detailed summary information here */}
      </CardContent>
    </Card>
  )
}