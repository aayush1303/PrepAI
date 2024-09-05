"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import the SpeechRecorder component for client-side rendering
const SpeechRecorder = dynamic(() => import('./SpeechRecorder'), { ssr: false });
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

const RecordSection = ({mockInterviewQuestions,activeQuestionIndex,interViewData}) => {

    const handleUserMediaError = (error) => {
        console.error("Webcam Error: ", error);
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <div className='flex flex-col justify-center my-10 items-center bg-black p-5 rounded-lg'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt='image' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                    onUserMediaError={handleUserMediaError} // Pass the error handler
                />
            </div>
            <SpeechRecorder 
            mockInterviewQuestions = {mockInterviewQuestions}
            activeQuestionIndex = {activeQuestionIndex}
            interViewData={interViewData}
            />
        </div>
    );
};

export default RecordSection;
