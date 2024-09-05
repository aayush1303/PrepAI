import { Button } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'
const InterviewItemCard = ({ interview }) => {

    const router = useRouter()

    const onStart = () => {
        router.push('/interview/' + interview?.mockId)
    }

    const onFeedback = () => {
        router.push('/interview/' + interview?.mockId + '/feedback')
    }

    return (
        <div className='border shadow-sm rounded-lg p-3'>
            <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience}</h2>
            <h2 className='text-xs text-gray-400'><strong>Created At: </strong>{interview.createdAt}</h2>
            <div className='flex justify-between mt-2 gap-5'>
                <Button onClick={onFeedback} variant='outline' size='sm' className='w-full'
                    sx={{
                        backgroundColor: '#EEEEEE',
                        color: 'black',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                            width: '100%'
                        }
                    }}>Feedback</Button>
                <Button onClick={onStart} size='sm' className='w-full'
                    sx={{
                        backgroundColor: '#4845D2',
                        color: 'white',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                            width: '100%'
                        }
                    }}>Start</Button>
            </div>
        </div>
    )
}

export default InterviewItemCard