'use client'
import React from 'react'
import quizData from '../../quiz.json'
import { Card, Progress, Label, Button, Radio, Checkbox } from 'flowbite-react'
import { useRouter } from 'next/navigation'


export default function Quiz({params}: {
  params: {
    subjectId: string
  }
}) {
  const [view, setView] = React.useState<'quiz' | 'result'>('quiz')
  const [error, setError] = React.useState<string>('')
  const [submission, setSubmission] = React.useState<{
    quizId: string
    isCorrect: boolean
    ansProvided: string[]
    correctAns: string[]
  }[]>([])
  const router = useRouter()
  const [activeQuizIndex, setActiveQuizIndex] = React.useState<number>(0)
  const subjectId = params.subjectId;
  const currentSubjectDetails = quizData.find((i) => i.id === subjectId);
  const currentQuizDetails = currentSubjectDetails?.quizzes?.[activeQuizIndex];

  if(!currentSubjectDetails || !currentQuizDetails) {
    return (
      <div>
        <h1>Subject not found</h1>
      </div>
    )
  }

  const totalProgress = (activeQuizIndex + 1) / currentSubjectDetails?.quizzes?.length * 100;


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    e.currentTarget.reset()
    if(Object.keys(data).length === 0) {
      setError('Please select an answer')
      return
    }
    const isCorrect  =   Object.keys(data).every(i=> {
      return data[i] === 'true'
    })
    setSubmission(prev=> ([
      ...prev,
      {
        quizId: currentQuizDetails.id,
        isCorrect,
        ansProvided: Object.keys(data),
        correctAns: currentQuizDetails.answers.filter(i=> i.correct).map(i=> i.answer)
      }
    ]))
    if(activeQuizIndex + 1 < currentSubjectDetails.quizzes.length) {
      setActiveQuizIndex(prev=> prev + 1)
    } else {
      setView('result')

    }
  }

  const handleFormOnChange = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if(Object.keys(data).length > 0) {
      setError('')
    }
  }

  return (
    <div className='w-full max-w-xl'>
      <Card className='mb-2 w-full'>
        <div className='flex mb-3 items-center'>
          <h5 className="text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>
              {currentSubjectDetails.subject}
            </p>
          </h5>
          <Button 
            onClick={
              () => {
                router.push('/')
              }
            } 
            color="failure" 
            className="ml-auto"
          >
            Cancel
          </Button>
        </div>
        <div className='flex items-center gap-3'>
          <div style={{width: "calc(100% - 50px)"}}>
            <Progress
              color="dark"
              progress={totalProgress}
              size="sm"
            />
          </div>
          <span>
            {activeQuizIndex + 1} / {currentSubjectDetails.quizzes.length}
          </span>
        </div>
      </Card>
      {view === "quiz" && (
        <form className='w-full' onChange={handleFormOnChange} onSubmit={handleSubmit}>
          <Card
            className="w-full"
          >
            <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              <p>
                {currentQuizDetails.question}
              </p>
            </h4>
            <div className='mt-2'>
              <div
                className="flex max-w-md flex-col gap-4"
                id="checkbox"
              >
                {currentQuizDetails.answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      value={answer.correct+""}
                      name={answer.answer}
                      id={answer.answer}
                    />
                    <Label
                      className="flex"
                      htmlFor={answer.answer}
                    >
                      <p>
                        {answer.answer}
                      </p>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {error && (
              <p className="text-red-500 mb-0">
                {error}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <Button type="submit">
                Save & Next
              </Button>
            </div>
          </Card>
        </form>
      )}
      {view === "result" && (
        <Card
          className="w-lg"
        >
          <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>
              Result
            </p>
          </h4>
          <div className='mt-2'>
            {submission.map((i, index) => {
              const quiz = currentSubjectDetails.quizzes.find((q) => q.id === i.quizId)
              return (
                <Card key={index} className="gap-2 mb-5">
                  <span 
                    style={{
                      backgroundColor: i.isCorrect ? 'green' : 'red'
                    }} 
                    className='p-1 px-2 rounded text-white'
                  >
                    {i.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      checked={i.isCorrect}
                      disabled
                    ></Checkbox>
                    
                    <p className='text-lg font-bold'>
                      {index + 1}. {quiz?.question}
                      
                    </p>
                  </div>
                  <p className='text-md mt-2'>
                    Your Answer: &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className='inline ml-2'>
                      {i.ansProvided.map((ans, index) => (
                        <span key={index} className='bg-blue-500 p-1 px-2 rounded text-white'>
                          {ans}
                          {index + 1 !== i.ansProvided.length && (
                              <span>, </span>
                            )
                          }
                        </span>
                      ))}
                    </div>
                  </p>
                  <p className='text-md mt-3'>
                    Correct Answer:
                    <div className='inline ml-2'>
                      {i.correctAns.map((ans, index) => (
                        <span key={index} className='bg-green-500 p-1 px-2 rounded text-white'>
                          {ans}
                          {index + 1 !== i.correctAns.length && (
                              <span>, </span>
                            )
                          }
                        </span>
                      ))}
                    </div>
                  </p>
                  <p>
                    <p className='font-bold'>
                      Explanation:
                    </p>
                    <p>
                      {
                        quiz?.explanation
                      }
                    </p>
                  </p>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-end mt-2">
            <Button 
              onClick={
                () => {
                  router.push('/')
                }
              } 
              color="success" 
              className="ml-auto"
            >
              Done
            </Button>
            <Button
              onClick={
                () => {
                  setView('quiz')
                  setActiveQuizIndex(0)
                  setSubmission([])
                }
              }
              color="failure"
              className="ml-2"
            >
              Retake
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
