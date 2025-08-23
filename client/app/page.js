'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {

    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')

    function handleSubmit(username) {
            fetch(`http://localhost:8080/api?username=${username}`)
                .then((response) => {response.json().then((data) => {
                    console.log(data)
                    setMessage(data.rank)
                })})
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleSubmit(username)
        }
    }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <Input
            className="w-100 mb-5 bg-white"
            placeholder="Input Player Name"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyDown={handleKeyDown}
        />
        <Button
            className="mb-5"
        onClick={() => handleSubmit(username)}>Search!
        </Button>
        {message ? <p>{message}</p> : null}
    </div>
  );
}
