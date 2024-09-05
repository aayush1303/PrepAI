"use client";

import React, { useState, useEffect } from 'react'
import { db } from '../../../../../utils/db'
import { eq } from 'drizzle-orm'
import { UserAnswer } from '../../../../../utils/schema'
import { Collapse, Button, Typography } from '@mui/material';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Feedback = ({ params }) => {

    const [feedbackList, setFeedbackList] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null);
    const router = useRouter()

    useEffect(() => {
        getFeedback()
    }, [])

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        console.log('Feedback:', result)
        setFeedbackList(result)
    }

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    return (
        <div className='p-18'>
            {feedbackList?.length == 0 ? <h2 className='text-gray-500 text-sm'>No feedback available</h2>
                :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
                    <h2 className='text-bold text-2xl'>Here is your interview report</h2>
                    <h2 className='text-primary text-lg my-3'>Your overall rating:<strong>7/10</strong></h2>
                    <h2 className='text-sm text-gray-500'>Find below questions with correct answers, Your answer and feedback for more improvement</h2>
                    {feedbackList && feedbackList.map((item, index) => (
                        <div key={index} className='my-2'>
                            <Button onClick={() => handleToggle(index)} variant="contained" className='w-full justify-between flex'>
                                {item.question}
                                <ChevronsUpDown size={20} className='right-0' />
                            </Button>
                            <Collapse in={expandedIndex === index}>
                                <Typography variant="body1" component="div">
                                    <div className='flex flex-col gap-2 mt-2'>
                                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
                                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong>{item.userAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong>{item.correctAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback:</strong>{item.feedback}</h2>
                                    </div>
                                </Typography>
                            </Collapse>
                        </div>
                    ))}
                </>
            }
            <Button onClick={() => router.replace('/')}
                sx={{
                    backgroundColor: '#4845D2',
                    color: 'white',
                    width: '100%',
                    '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                        width: '100%'
                    }
                }}>Go Home</Button>
        </div>
    )
}

export default Feedback