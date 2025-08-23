'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Home() {

    const [message, setMessage] = useState('Loading')

    useEffect(() => {
        fetch('http://localhost:8080/api?username=sky-fa-ll')
            .then((response) => {response.json().then((data) => {
                console.log(data)
                setMessage(data.rank)
            })})
    }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        {message}
    </div>
  );
}
