"use client"
import React, { useEffect } from 'react'
import { MockInterview } from '../../../../utils/schema'
import { db } from '../../../../utils/db'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@mui/material'
import Link from 'next/link'

const Interview = ({ params }) => {

    const [interviewData, setInterviewData] = React.useState([])
    const [webCamEnabled, setWebCamEnabled] = React.useState(false);
    useEffect(() => {
        getInterviewDetails()
    }, [])

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId))

        setInterviewData(result[0]);
    }

    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-1 '>
                    <div className='p-5 rounded-lg border'>
                        <h2 className='text-lg'><strong>Job Position: </strong>{interviewData.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description: </strong>{interviewData.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='gap-2 flex items-center text-yellow-500'><strong><Lightbulb />Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INTERVIEW_INFO}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? <Webcam
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{
                            height: 300,
                            width: 300
                        }}
                    />
                        :
                        <>
                            <WebcamIcon className='h-72 w-full my-5 p-20 bg-secondary rounded-lg border' />
                            <Button
                                onClick={() => setWebCamEnabled(true)}
                                type='button'
                                sx={{
                                    backgroundColor: '#4845D2',
                                    color: 'white',
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                        width: '100%'
                                    }
                                }}>Enable Web Cam and Microphone
                            </Button>
                        </>
                    }
                </div>
            </div>
            <div className='flex justify-end items-end '>
                <div style={{ width: '48.5%', marginTop: '10px' }}>
                    <Button
                        onClick={() => setWebCamEnabled(true)}
                        type='button'
                        sx={{
                            backgroundColor: '#4845D2',
                            color: 'white',
                            width: '100%',
                            '&:hover': {
                                backgroundColor: 'black',
                                color: 'white'
                            }
                        }}
                    >
                        <Link href={'/interview/' + params.interviewId + '/start'} passHref>
                            Start Interview
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Interview