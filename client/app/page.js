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

    function handleSubmit(username) {
            fetch(`http://localhost:8080/api?username=${username}`)
                .then((response) => {response.json().then((data) => {
                    console.log(data)
                    setMessage(data.rank)
                })})
    }

    function handleSchoolSubmit(schoolName, gradeNum, classNum) {
        setMessage('loading')
        fetch(`http://localhost:8080/schoolinfo?schoolName=${schoolName}&gradeNum=${gradeNum}&classNum=${classNum}`)
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


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div>
            <div className="flex flex-row w-70 mb-4 gap-2">
                <Input
                    className="bg-white w-200"
                    placeholder="학교 이름"
                    type="text"
                    name="schoolName"
                    onChange={(e) => setSchoolName(e.target.value)}
                    value={schoolName}
                />
                <Input
                    className="bg-white"
                    placeholder="학년"
                    type="text"
                    name="gradeNum"
                    onChange={(e) => setGradeNum(e.target.value)}
                    value={gradeNum}
                />
                <Input
                    className="bg-white"
                    placeholder="반"
                    type="text"
                    name="classNum"
                    onChange={(e) => setClassNum(e.target.value)}
                    value={classNum}
                />

                <Button
                    className="mb-5"
                    onClick={() => handleSchoolSubmit(schoolName, gradeNum, classNum)}>제출!
                </Button>

            </div>

        </div>

        {message ? (
            message === 'loading' ? (
                <Skeleton className="w-100 h-120"/>
            ) : (
                <Textarea
                    className="outline-5 bg-gray-100 w-100 h-120"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            )
        ) : null}

    </div>
  );
}
