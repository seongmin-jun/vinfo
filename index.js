  // require the packages so that they can be used in this file
  const axios = require('axios')
  const cheerio = require('cheerio')
  const express = require('express')
  const domain = 'https://atlas.microsoft.com'
  const https = require('https')
  let instance
  let instance2

  function getAxios() {

        //create axios instance
        instance = axios.create({
            baseURL: domain,
            timeout: 1000000000, //optional
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: {'Content-Type':'application/xml'}
        })

    return instance;
      }
 

  var articles = [] // the results of the scraping are stored here
  let texts = []
  var counterArticles = 0;

  async function scrapeData(){
    instance = await getAxios()
    

      // by this function, the package is "activated"
      const app = express()
      //const url = 'https://www.theguardian.com/uk' // use this for testing with guardian
      const url = 'https://corona-blog.net/blog-archiv/'

      
//       try { ...} catch (e) {console.log (e)}
      
      const response = await instance.get(url) // returns a promise (if mistake, then response is error message)

      const html = response.data
      const $ = cheerio.load(html)

      $('.listing-item', html).each(function(){
          const text = $(this).text() // grabs the text of this html-element
          const urlHTML = $(this).find('a').attr('href')
          articles.push({
              text,
              urlHTML
          })
      })
    

			//     urls now has the links
     await getTexts()

     console.log("counterArticles = "+  counterArticles)
     //console.log(urls)
     //console.log(texts)
     
     
     let csvContent = "data:text/csv;charset=utf-8," 
    
     
     texts.forEach(function(rowArray) {
        //let url = rowArray[0]
        //let textInhalt = rowArray[1]
        csvContent += rowArray[0].replaceAll(";", " ") + "\r\n";}
        //csvContent += url + ";" + textInhalt.replaceAll(";", " ") + "\r\n";}
        ); 

     const fs = require('fs').promises;
     // Define some text to be written to a file
    
     try {
         // Write text to the given file name
         // await tells JavaScript to wait for the asyncronous function (Promise) to resolve before continuing
         await fs.writeFile('coronaBlogTexte.csv', csvContent, {encoding: "ascii"}); 
     } catch (error) {
         // Output any errors for inspection
         console.log(error);
     }  
        
    
    return texts;
  }

  //---------------------------------------------------------------------------------------------

   async function getTexts(){

      // [1,2,3].map(el => el * el) => [1, 4, 9]
      // [{element: ...}, ...] => [Promise, Promise, Promise]

      await Promise.all(articles.map(async element => { // async functions return Promise
       
        try{
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
        // Promise.then(callback) -> callback(result des promises) 
        // const result = await Promise
        const response = await instance.get(element.urlHTML) // returns Promise<Response>
        var text = "" 
        
        const html = response.data
        const $ = cheerio.load(html)
        var length = $('.wp-block-getwid-section__inner-content', html).length;
        var counter = 1;
        $('.wp-block-getwid-section__inner-content', html).each(function(){
            //get the text
            text += $(this).find('p').text()
               
            if(counter == length){
            //texts.push([element.urlHTML, text]);
            texts.push([text]);          
            }else{
            counter++;
            }  // 1
        })  
        // counterArticles = counterArticles +1;
        // console.log("counterArticles = " + counterArticles)
        }
        catch(err){
            console.log(err.message + " 2")
        }

          
      }))
      .catch((error) => {
        console.error(error.message + " 3");
      })
  }

  // invoke function above 
  
scrapeData()

