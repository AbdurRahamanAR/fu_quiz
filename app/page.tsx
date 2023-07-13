'use client'
import quiz from './quiz.json'
import { Card } from 'flowbite-react'

export default function Home() {
  return (
    <div>
        <p className="max-w-[400px] mx-auto text-center mb-5 text-md font-bold tracking-tight text-gray-900 dark:text-white">
          Select a topic. Based on your mood, you can choose a topic that you want to learn more about.
        </p>
        <div className='flex gap-3 flex-wrap md:flex-nowrap'>
          {quiz.map((i) => (
            <Card
              key={i.id}
              className="max-w-sm w-full mx-auto md:w-1/2"
              href={`/quiz/${i.id}`}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>
                {i.subject}
                </p>
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                  {i.description}
                </p>
              </p>
            </Card>
          ))}
        </div>
    </div>
  )
}






