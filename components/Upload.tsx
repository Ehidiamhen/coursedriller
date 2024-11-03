'use client'

import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../utils/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Upload() {
  const [files, setFiles] = useState([])
  const [courseTitle, setCourseTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const history = useHistory()

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', courseTitle)
    files.forEach((file) => formData.append('materials', file))

    try {
      await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('Course materials uploaded successfully!')
      history.push('/dashboard')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload course materials. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-[450px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>Upload Course Materials</CardTitle>
        <CardDescription>Upload your course materials in PDF, PowerPoint, Word, or JPEG format.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="materials">Course Materials</Label>
              <Input
                id="materials"
                type="file"
                onChange={handleFileChange}
                multiple
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isUploading}>
          {isUploading ?   'Uploading...' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  )
}