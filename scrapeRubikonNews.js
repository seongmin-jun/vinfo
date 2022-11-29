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
    //const url = 'https://www.theguardian.com/uk' // use this for testing with guardian test
    const url = 'https://www.rubikon.news/artikel/suche?search_articles%5Bquery%5D=corona+impfung+covid&search_articles%5Bsort%5D=chronologisch+absteigend&start_month=3&start_year=2017&end_month=7&end_year=2022'

    axios(url) // returns a promise (if mistake, then response is error message)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('.article-content', html).each(function(){ // for testing with guardian: ultp-block-title fc-item__title
            const text = $(this).text() // grabs the text of this html-element
            const urlHTML = 'https://www.rubikon.news' + $(this).find('a').attr('href')
            articles.push({
                text,
                urlHTML
            })
            
        })
      // console.log(articles) // um Titel und Links auszugeben beim Debuggen
        console.log("Output of article titles and links finished")
      getTexts()
    }).catch(err => console.log(err))
// the port we listen to
const PORT = 8000
app.listen(PORT, () => console.log('server running on PORT ${PORT}'))
}

//---------------------------------------------------------------------------------------------

async function getTexts(){
    console.log('getTexts started')
    //const app2 = express() ok
    var j = 0
    articles.forEach(element => {
       j = j +1
        var descriptionVorlage = 'Rubikon-News-Artikel Nummer: ' + j
        axios(element.urlHTML)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)
                
                $('.article-content', html).each(function(){
                    //get the text
                    //const text = ''
                    const text = $(this).find('p').text()
                    const description = descriptionVorlage;
                    texts.push(description, element.text, element.urlHTML, text)
                })
                console.log(texts)
                
            }).catch(err => console.log(err))
    });

    //const PORT = 8080
    //app2.listen(PORT, () => console.log('GetTexts: sever running on PORT ${PORT}'))
}

// invoke function above 
scrapeData()
