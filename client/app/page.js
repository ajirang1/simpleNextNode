'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

    function handleKeyDown(e) {
        if (e.key === "Enter" && schoolName && gradeNum && classNum) {
            handleSubmit(username)
        } else {
            setMessage('학교 이름이나 반, 번호를 제대로 선택했는지 확인해주세요!')
        }
    }

    function handleSchoolSubmit(schoolName, gradeNum, classNum) {
        fetch(`http://localhost:8080/schoolinfo?schoolName=${schoolName}&gradeNum=${gradeNum}&classNum=${classNum}`)
            .then((response) => {response.json().then((data) => {
                console.log(data)
                if (data.errmsg) {
                    setMessage(data.errmsg)
                } else {
                    const messageSetting = JSON.stringify(data)
                    setMessage(messageSetting)
                }
            })})
    }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="flex flex-row w-70 mb-4 gap-2">
            <Input
                className="bg-white w-200"
                placeholder="학교 이름"
                type="text"
                name="schoolName"
                onChange={(e) => setUsername(e.target.value)}
                value={schoolName}
                onKeyDown={handleKeyDown}
            />
            <Input
                className="bg-white"
                placeholder="학년"
                type="text"
                name="gradeNum"
                onChange={(e) => setGradeNum(e.target.value)}
                value={gradeNum}
                onKeyDown={handleKeyDown}
            />
            <Input
                className="bg-white"
                placeholder="반"
                type="text"
                name="classNum"
                onChange={(e) => setClassNum(e.target.value)}
                value={classNum}
                onKeyDown={handleKeyDown}
            />
        </div>

        <Button
            className="mb-5"
        onClick={() => handleSchoolSubmit(schoolName, gradeNum, classNum)}>제출!
        </Button>
        {message ? <p>{message}</p> : null}
    </div>
  );
}
