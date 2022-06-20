# vinfo

there are several packages that were installed:

axios: Promise based HTTP client for the browser and node.js; lets you perfom HTTP request to REST api's and CRUD function

express: minimalist web framework for node.js

cheerio: used to pick out html-elements; similiar to jQuery

"nodemon index.js" in the package.json file listens for changes made in the index.js file 

----------------------------------------------------------------------------


// require the packages so that they can be used in this file
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const express = require('express')

// by this function, the package is "activated"
const app = express()
//const url = 'https://www.theguardian.com/uk' // use this for testing with guardian
const urlFirstLoop = 'https://corona-blog.net/blog-archiv/'

var articles = [] // here, the titles and the links are stored. This is the result of the first cycle
var texts = []    // here, the texts of the articles are stored

async function scrapeData(url, htmlElementToScrape,findInnerHtmlElement, arrayToStoreResults){
    axios(url) // returns a promise (if mistake, then response is error message)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        

        $(htmlElementToScrape, html).each(function(){ // for testing with guardian: ultp-block-title fc-item__title
            const text = $(this).text() // grabs the text of this html-element
            const urlHTML = $(this).find(findInnerHtmlElement).attr('href')
            arrayToStoreResults.push({
                text,
                urlHTML
            })
            
        })
        console.log(arrayToStoreResults)

        // the recursion process should stop after the second recursion. 
        // Here, it is done by adressing the "htmlElementToScrape". Might be changed later though!
        if(htmlElementToScrape == 'wp-block-getwid-section__inner-content'){return}


        // by now the hrefs are stored in the array articles, now we have to use the given urls to save the text
        articles.forEach(element => {
            scrapeData(element.urlHTML, 'wp-block-getwid-section__inner-content', 'p', texts)
        });
        
    }).catch(err => console.log(err))
// the port we listen to
const PORT = 8000


app.listen(PORT, () => console.log('sever running on PORT ${PORT}'))
}

// Invoke the function above
scrapeData(urlFirstLoop,'.listing-item', 'a', articles)