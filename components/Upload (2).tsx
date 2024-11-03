'use client'

import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../utils/api'

export default function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const [courseTitle, setCourseTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const history = useHistory()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upload Course Materials
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Upload your course materials in PDF, PowerPoint, Word, or JPEG format.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="course-title" className="sr-only">
                Course Title
              </label>
              <input
                id="course-title"
                name="title"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Course Title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="course-materials" className="sr-only">
                Course Materials
              </label>
              <input
                id="course-materials"
                name="materials"
                type="file"
                multiple
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isUploading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}