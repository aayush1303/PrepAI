"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { eq } from 'drizzle-orm'
import { MockInterview } from '../../../../../utils/schema'

import QuestionsSection from './_components/QuestionsSection'
import RecordSection from './_components/RecordSection'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const StartInterview = ({ params }) => {

  const [interViewData, setInterviewData] = useState();
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const router = useRouter()

  const handleFeedback = () => {
    router.push('/interview/'+interViewData?.mockId+"/feedback")
  }

  useEffect(() => {
    getInterviewDetails()
  }, []);

  const getInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId))

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)
    setMockInterviewQuestions(jsonMockResp)
    setInterviewData(result[0]);
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interViewData={interViewData}
        />
      </div>
      <div className='flex justify-end gap-6 mt-2 md:mt-[-40px]'>
        {activeQuestionIndex > 0 && <Button
          onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          sx={{
            backgroundColor: '#4845D2',
            color: 'white',
            width: '20%',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
              width: '20%',
            },
          }}>Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQuestions?.length - 1 && <Button
          onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          sx={{
            backgroundColor: '#4845D2',
            color: 'white',
            width: '20%',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
              width: '20%',
            },
          }}>Next Question</Button>}
        {activeQuestionIndex == mockInterviewQuestions?.length - 1 &&
            <Button
            onClick={handleFeedback}
              sx={{
                backgroundColor: '#4845D2',
                color: 'white',
                width: '20%',
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white',
                  width: '20%',
                },
              }}>End Interview</Button>}
      </div>
    </div>
  )
}

export default StartInterview