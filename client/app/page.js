'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Skeleton} from "@/components/ui/skeleton";
import {Text} from "lucide-react";

export default function Home() {

    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')
    const [schoolName, setSchoolName] = useState('동패고등학교')
    const [gradeNum, setGradeNum] = useState(2)
    const [classNum, setClassNum] = useState(9)
    const [customMessage, setCustomMessage] = useState('')

    useEffect(() => {
        if (localStorage.getItem('customMessage') !== null) {
            setCustomMessage(localStorage.getItem('customMessage'))
        }
	if (localStorage.getItem('schoolName') !== null) {
	    setSchoolName(localStorage.getItem('schoolName'))
	}
	if (localStorage.getItem('gradeNum') !== null) {
	    setGradeNum(localStorage.getItem('gradeNum'))
	}
	if (localStorage.getItem('classNum') !== null ) {
	    setClassNum(localStorage.getItem('classNum'))
	}
    }, []);

    function handleSubmit(username) {
            fetch(`http://localhost:8080/api?username=${username}`)
                .then((response) => {response.json().then((data) => {
                    console.log(data)
                    setMessage(data.rank)
                })})
    }

    function handleSchoolSubmit(schoolName, gradeNum, classNum, customMessage) {
        localStorage.setItem("customMessage", customMessage)
	localStorage.setItem("schoolName", schoolName)
	localStorage.setItem("classNum", classNum)
	localStorage.setItem("gradeNum", gradeNum)
        setMessage('loading')
        const qs = new URLSearchParams({ customMessage }).toString()
        fetch(`/schoolinfo?schoolName=${schoolName}&gradeNum=${gradeNum}&classNum=${classNum}&${qs}`)
            .then((response) => {response.json().then((data) => {
                console.log(data)
                if (data.errmsg) {
                    setMessage(data.errmsg)
                } else {
                    const messageSetting = data.realMessage
                    setMessage(messageSetting)
                }
            })})
    }

    async function handleCopyClick() {
        try {
            await navigator.clipboard.writeText(message)
            console.log(message)
        } catch (err) {
            console.error(err)
        }
    }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div>
            <div className="flex flex-row w-200 mb-4 gap-2">
                <Input
                    className="bg-white w-140"
                    placeholder="학교 이름"
                    type="text"
                    name="schoolName"
                    onChange={(e) => setSchoolName(e.target.value)}
                    value={schoolName}
                />
                <Input
                    className="bg-white w-30"
                    placeholder="학년"
                    type="text"
                    name="gradeNum"
                    onChange={(e) => setGradeNum(e.target.value)}
                    value={gradeNum}
                />
                <Input
                    className="bg-white w-30"
                    placeholder="반"
                    type="text"
                    name="classNum"
                    onChange={(e) => setClassNum(e.target.value)}
                    value={classNum}
                />

                <Textarea
                    className="bg-white w-300 min-h-20"
                    placeholder="추가 알림 사항"
                    name="customMessage"
                    onChange={(e) => setCustomMessage(e.target.value)}
                    value={customMessage}
                />

                <Button
                    className="mb-5"
                    onClick={() => handleSchoolSubmit(schoolName, gradeNum, classNum, customMessage)}>제출!
                </Button>

            </div>

        </div>

        {message ? (
            message === 'loading' ? (
                <Skeleton className="w-100 h-120"/>
            ) : (
                <div className="flex flex-row justify-center items-center">
                    <Textarea
                        className="outline-5 bg-gray-100 w-100 h-120"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button
                    className="bg-black text-white w-30 h-60 ml-20"
                    onClick={() => handleCopyClick()}>
                        복사하기!
                    </Button>
                </div>
            )
        ) : null}

    </div>
  );
}
