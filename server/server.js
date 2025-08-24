const express = require('express')
const cors = require('cors')
const PORT = 8080
const app = express()
require('dotenv').config()

app.use(cors())

app.get('/api', (req, res) => {
    const { username } = req.query;
    fetch(`https://ch.tetr.io/api/users/${username}/summaries/league`).then((response) => {
        response.json().then((data) => {
            if (data.success) {
                res.json({rank: `${data.data.rank}`})
                console.log(data.data.rank, username)
            } else {
                res.json({rank: `${data.error.msg}`})
                console.log(data.error.msg, username)
            }
            console.log(data)
        })
    })
    console.log('Rank sent!')
})

app.get('/schoolinfo', (req, res) => {
    const { schoolName, gradeNum, classNum } = req.query
    let schoolCode;
    let ofcdcCode;
    let today = new Date();
    let regulatedDay = today
    let newMonth;
    let foodData;
    let timeData;

    console.log({schoolName, gradeNum, classNum})

    if (today.getDay() == 0) {
        regulatedDay.setDate(today.getDate() + 1)
    } else if (today.getDay() == 6) {
        regulatedDay.setDate(today.getDate() + 2)
    }

    console.log(regulatedDay.getMonth().toString())

    if (regulatedDay.getMonth().toString().length === 1) {
        newMonth = `0`+ `${(regulatedDay.getMonth() + 1).toString()}`
        console.log(newMonth)
    }

    console.log(`${regulatedDay.getFullYear()}${newMonth}${regulatedDay.getDate()}`)
    const finDateYMD = `${regulatedDay.getFullYear()}${newMonth}${regulatedDay.getDate()}`

    async function getFoodData() {
        await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${ofcdcCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${finDateYMD}`).then((response) => {
            return response.json().then(async (data) => {
                if(data.RESULT) {
                    res.json({errmsg: data.RESULT.MESSAGE + `급식, res`})
                } else {
                    if(data.mealServiceDietInfo[0].head[1].RESULT.CODE === "INFO-000") {
                        foodData = data.mealServiceDietInfo[1].row[0].DDISH_NM
                        console.log(foodData)
                    } else {
                        res.json({errmsg: data.mealServiceDietInfo[0].head[1].RESULT.MESSAGE + `급식`, errcd: data.mealServiceDietInfo[0].head[1].RESULT.CODE})
                    }
                }
            })
        })
    }

    async function getTimeline() {
        await fetch(`https://open.neis.go.kr/hub/hisTimetable?KEY=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=7&ATPT_OFCDC_SC_CODE=${ofcdcCode}&SD_SCHUL_CODE=${schoolCode}&ALL_TI_YMD=${finDateYMD}&GRADE=${gradeNum}&CLASS_NM=${classNum}`).then((response) => {
            return response.json().then(async (data) => {
                if(data.RESULT) {
                    res.json({errmsg: data.RESULT.MESSAGE + `시간표, res`})
                } else {
                    if(data.hisTimetable[0].head[1].RESULT.CODE === "INFO-000") {
                        timeData = data.hisTimetable[1].row
                        console.log(timeData)
                    } else {
                        res.json({errmsg: data.hisTimetable[0].head[1].RESULT.MESSAGE + `시간표`, errcd: data.hisTimetable[0].head[1].RESULT.CODE})
                    }
                }
            })
        })
    }

    fetch(`https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=5&SCHUL_NM=${schoolName}`).then((response) => {
        response.json().then(async (data) => {
            try {

                if (data.RESULT) {
                    res.json({errmsg: data.RESULT.MESSAGE + `반정보, res`})
                } else {
                    if (data.schoolInfo[0].head[1].RESULT.CODE === `INFO-000`) {
                        schoolCode = data.schoolInfo[1].row[0].SD_SCHUL_CODE
                        console.log(schoolCode)
                        ofcdcCode = data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE
                        console.log(ofcdcCode)
                        await getFoodData()
                        await getTimeline()

                        let message;
                        let newString = foodData.replace(/<br\s*\/?>/gi, '\n');

                        const lessons = timeData
                            .map((row, i) => row?.ITRT_CNTNT ? `${i + 1}.${row.ITRT_CNTNT}` : null)
                            .filter(Boolean)
                            .join('\n');

                        message = `${newMonth}/${regulatedDay.getDate()}\n
[시간표]
${lessons}\n
[급식]
${newString}\n
[기타]`;


                        console.log(message)
                        await res.status(200).json({schoolName, foodData, timeData, realMessage: message })

                    } else {
                        res.json({errmsg: data.schoolInfo[0].head[1].RESULT.MESSAGE + `반정보`})
                    }
                }

            } catch (err) {
                console.error(err)
            }
            
        })
    })
})

app.listen(PORT, () => {
    console.log(`LISTENING ON ${PORT}`)
})