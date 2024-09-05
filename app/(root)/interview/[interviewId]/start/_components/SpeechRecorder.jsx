"use client";

import React, { useState, useEffect, use } from 'react';
import { Button, useForkRef } from '@mui/material';
import { StopCircle } from 'lucide-react';
import { Mic } from 'lucide-react';
import chatSession from '../../../../../../utils/gemini';
import useSpeechToText from 'react-hook-speech-to-text';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '../../../../../../utils/schema';

const SpeechRecorder = ({mockInterviewQuestions,activeQuestionIndex,interViewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser();
    const[loading,setLoading]=useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        results.map((result) => {
            setUserAnswer((prevAns) => prevAns + result?.transcript);
        });
    }, [results]);

    useEffect(() => {
       if(!isRecording && userAnswer?.length>10){
           updateUserAnswer()
       }
    },[userAnswer])

    const saveUserAnswer = async() => {
        if(isRecording){
            stopSpeechToText()
        }else{
            setUserAnswer('')
            startSpeechToText()
        }
    }

    const updateUserAnswer = async () => {
        console.log('User Answer:', userAnswer);
        setLoading(true);
    
        try {
            const feedbackPrompt = 'Question:' + mockInterviewQuestions[activeQuestionIndex]?.question
                + ', User Answer:' + userAnswer
                + ' Depends on the question and user answer for the given interview question'
                + ' please give us a rating for the answer and feedback as an area of improvement if any'
                + ' in just 3 to 5 lines in JSON format with rating and feedback fields';
    
            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
            console.log(mockJsonResp);
            const jsonResp = JSON.parse(mockJsonResp);
    
            await db.insert(UserAnswer)
                .values({
                    mockIdRef: interViewData?.mockId,
                    question: mockInterviewQuestions[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                    userAns: userAnswer,
                    feedback: jsonResp?.feedback,
                    rating: jsonResp?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                });
    
            console.log('User answer saved successfully');
            setUserAnswer('');
            setResults([]);  
        } catch (error) {
            console.error('Error saving user answer:', error);
        } finally {
            setUserAnswer('');
            setResults([]);
            setLoading(false);
        }
    };
    

    return (
        <div>
            <Button
                disabled={loading}
                onClick={saveUserAnswer}
                sx={{
                    backgroundColor: '#4845D2',
                    color: 'white',
                    width: '100%',
                    '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                        width: '100%',
                    },
                }}
            >
                {isRecording ? (
                    <h2 className='text-red-600 flex gap-2 items-center justify-center'>
                        <StopCircle /> Stop Recording....
                    </h2>
                ) : (
                    <h2 className='flex gap-1 items-center justify-center'><Mic size={20} /> RECORD ANSWER</h2>
                )}
            </Button>
        </div>
    );
};

export default SpeechRecorder;
