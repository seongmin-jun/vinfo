// require the packages so that they can be used in this file
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const express = require('express')
const { get } = require('express/lib/response')

var articles = [] // the results of the scraping are stored here
var texts = []

async function scrapeData(){
    // by this function, the package is "activated"
    const app = express()
    //const url = 'https://www.theguardian.com/uk' // use this for testing with guardian
    const url = 'https://corona-blog.net/blog-archiv/'

    axios(url) // returns a promise (if mistake, then response is error message)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('.listing-item', html).each(function(){ // for testing with guardian: ultp-block-title fc-item__title
            const text = $(this).text() // grabs the text of this html-element
            const urlHTML = $(this).find('a').attr('href')
            articles.push({
                text,
                urlHTML
            })
            
        })
        console.log(articles)
        console.log("Output of article titles and links finished")
    }).catch(err => console.log(err))
// the port we listen to
const PORT = 8000

app.listen(PORT, () => console.log('sever running on PORT ${PORT}'))

getTexts()
}

async function getTexts(){
    const app2 = express()

    articles.forEach(element => {
        axios(element.urlHTML)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('wp-block-getwid-section__inner-content', html).each(function(){
                    //get the text
                    const text = ''
                    $(this).find('p').forEach(element => {
                        text.concat(element.text())
                    })
                    texts.push(element.urlHTML, text)
                })
                console.log(texts)
                console.log("Output of texts finished")
            }).catch(err => console.log(err))
    });

    const PORT = 8080
    app2.listen(PORT, () => console.log('sever running on PORT ${PORT}'))
}

// invoke function above 
scrapeData()

