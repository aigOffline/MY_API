const PORT = process.env.PORT || 8000 || config.httpPort;
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const newspapers = [
    {
        name: 'greenpeace',
        address: 'https://greenpeace.ru/projects/izmenenie-klimata/',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/russian/features-59325328',
        base: 'https://www.bbc.com'
    },
    {
        name: 'who',
        address: 'https://www.who.int/ru/news-room/fact-sheets/detail/climate-change-and-health',
        base: ''
    },
    {
        name: 'amnesty',
        address: 'https://eurasia.amnesty.org/chto-my-delaem/izmenenie-klimata/',
        base: 'https://eurasia.amnesty.org'
    },
    {
        name: 'fao',
        address: 'https://www.fao.org/3/cb4769ru/online/src/html/effects-climate-change-on-agriculture-forestry-and-ecosystems.html',
        base: 'https://www.fao.org'
    },
    {
        name: 'tass',
        address: 'https://tass.ru/spec/climate',
        base: 'https://tass.ru'
    },
    {
        name: 'unep',
        address: 'https://www.unep.org/ru/regions/evropa/regionalnye-iniciativy/reagirovanie-na-izmenenie-klimata',
        base: 'https://www.unep.org'
    },
    {
        name: 'unesco',
        address: 'https://ru.unesco.org/themes/izmenenie-klimata',
        base: ''
    },
    {
        name: 'wipo',
        address: 'https://www.wipo.int/policy/ru/climate_change/',
        base: 'https://www.wipo.int'
    },
    {
        name: 'rbc',
        address: 'https://www.rbc.ru/tags/?tag=%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BB%D0%B8%D0%BC%D0%B0%D1%82%D0%B0',
        base: 'https://www.rbc.ru'
    },
    {
        name: 'osce',
        address: 'https://www.osce.org/ru/proekty/izmenenie-klimata-i-bezopasnost',
        base: 'https://www.osce.org'
    },
    {
        name: 'nornickel',
        address: 'https://www.nornickel.ru/sustainability/climate-change/strategy/',
        base: 'https://www.nornickel.ru'
    },
    {
        name: 'meteorf',
        address: 'http://www.meteorf.ru/about/smi/503/',
        base: ''
    },
    {
        name: 'roscongress',
        address: 'https://roscongress.org/knowledge/izmenenie-klimata/materials/',
        base: 'https://roscongress.org'
    },
    {
        name: 'iso',
        address: 'https://www.iso.org/ru/sdg/SDG13.html',
        base: 'https://www.iso.org'
    },
    {
        name: 'asi',
        address: 'https://www.asi.org.ru/news/2020/07/20/v-seti-startoval-klimaticheskij-fleshmob-izmenenie-klimata-chto-delat/',
        base: 'https://www.asi.org.ru'
    },
    {
        name: 'wfp',
        address: 'https://ru.wfp.org/climate-action',
        base: ''
    },
    {
        name: 'ipcc',
        address: 'https://www.ipcc.ch/languages-2/russian/',
        base: ''
    },
    {
        name: 'dw',
        address: 'https://www.dw.com/ru/cop26-klimaticheskij-krizis-v-11-grafikah/a-59721345',
        base: 'https://www.dw.com'
    }
    
]


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(res => {
            const html = res.data
            const $ = cheerio.load(html)

            $('a:contains("климата")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})



const articles = []
app.get('/', (req, res) => {
    res.json('Добро пожаловать на мой API по изменению климата!')
})

app.get('/news', (req,res) => {
       
    res.json(articles)
        
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("климата")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})



app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));