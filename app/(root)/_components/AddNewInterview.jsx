"use client"
import React from 'react'
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import chatSession from "../../../utils/gemini"
import {db} from "../../../utils/db"
import {MockInterview} from "../../../utils/schema"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';



const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const [jobPosition, setJobPosition] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');
    const [jobExperience, setJobExperience] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [jsonResponse, setJsonResponse] = React.useState([]);
    const { user } = useUser();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const inputPrompt = "Job Position: " + jobPosition + ", Job Description: " + jobDescription + ", Years of Experience : " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + ", Depends on Job Position, Job Description & Years of Experience give us 5 Interview question along with Answer in JSON format, Give us question and answer field on JSON ";

            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
            console.log(JSON.parse(mockJsonResp));
            setJsonResponse(mockJsonResp);

            if (mockJsonResp) {
                const resp=await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: mockJsonResp,
                        jobPosition: jobPosition,
                        jobDesc: jobDescription,
                        jobExperience: jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).returning({ mockId: MockInterview.mockId })
                    console.log(resp);
                    if(resp){
                        setOpenDialog(false);
                        router.push('/interview/'+resp[0]?.mockId);
                    }
            } else {
                console.log("Error generating interview questions");
            }

        } catch (error) {
            console.error("Error generating interview questions:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            {user ? (
                <div
                    className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                    onClick={handleOpenDialog}
                >
                    <h2 className='font-bold text-lg text-center'>+ Add New</h2>
                </div>
            ) : (
                <div className="p-10 border rounded-lg bg-secondary">
                    <h2 className='font-bold text-lg text-center'>Sign in to start your interview practice</h2>
                </div>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    <h2 className='text-2xl text-black'>Tell us more about your job interviewing</h2>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <div>
                            <h2>Add details about your job description</h2>
                            <div className='mt-5 my-2 flex flex-col'>
                                <label className='font-bold mb-1'>Job Position</label>
                                <TextField
                                    id="outlined-basic"
                                    label="Ex Full Stack Developer"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={jobPosition}
                                    onChange={(e) => setJobPosition(e.target.value)}
                                />
                            </div>
                            <div className='mt-5 my-2 flex flex-col'>
                                <label className='font-bold mb-1'>Job Description</label>
                                <TextField
                                    id="outlined-basic"
                                    label="Ex React, Node.js"
                                    variant="outlined"
                                    multiline
                                    required
                                    fullWidth
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>
                            <div className='mt-5 my-2 flex flex-col'>
                                <label className='font-bold mb-1'>No of Year Experience</label>
                                <TextField
                                    id="outlined-basic"
                                    label="1"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={jobExperience}
                                    onChange={(e) => setJobExperience(e.target.value)}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type='button'
                            onClick={handleCloseDialog}
                            sx={{
                                backgroundColor: 'gray',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type='submit'
                            loading={loading}
                            variant="outlined"
                            loadingPosition="start"
                            sx={{
                                backgroundColor: '#4845D2',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                },
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap:'5px',
                            }}
                        >
                            {loading ? "Generating Questions..." : "Start Interview"}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default AddNewInterview;
