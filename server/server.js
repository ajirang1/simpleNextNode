const express = require('express')
const cors = require('cors')
const PORT = 8080
const app = express()

app.use(cors())

app.get('/api', (req, res) => {
    const { username } = req.query;
    fetch(`https://ch.tetr.io/api/users/${username}/summaries/league`).then((response) => {
        response.json().then((data) => {
            if (data.success) {
                res.json({rank: `${data.data.rank}`})
                console.log(data.data.rank)
            } else {
                res.json({rank: `${data.error.msg}`})
                console.log(data.error.msg)
            }
            console.log(data)
        })
    })
    console.log('Rank sent!')
})

app.listen(PORT, () => {
    console.log(`LISTENING ON ${PORT}`)
})