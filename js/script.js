
const submitButton = document.querySelector('#submitButton')
let rowsInserted = 0

submitButton.addEventListener('click', async() =>{
    event.preventDefault()
    let raceYear = document.querySelector('#seasonInput').value
    let raceRound = document.querySelector('#roundInput').value
    const data = await getApiRaceData(raceYear, raceRound)
    const tableData =  parseRaceData(data)
    handleTableData(tableData)
})

async function getApiRaceData(season, round){
    const res = await fetch(`http://ergast.com/api/f1/${season}/${round}/driverstandings.json`)

    if(res.ok){
        const data = await res.json()
        return data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings']
    }
}

function parseRaceData(data){

    const tableData = {
        "drvPosition" : [],
        "drvName" : [],
        "drvNation" :[],
        "drvSponsor" : [],
        "drvPoints" : []
    }
    let countReturned = 1
    for (let ele of data){
        if (countReturned < 8){
            tableData['drvPosition'].push(ele['position'])
            tableData['drvName'].push((ele['Driver']['givenName'])+" "+(ele['Driver']['familyName']))
            tableData['drvNation'].push(ele['Driver']['nationality'])
            tableData['drvSponsor'].push(ele['Constructors'][0]['name'])
            tableData['drvPoints'].push(ele['points'])
            ++countReturned
        }else{
            return tableData   
        }    // end if
    }// end for
    return tableData
}// end func 

function handleTableData(tableData){
    if(rowsInserted !== 0){
        for (rowsInserted; rowsInserted > 0; rowsInserted--){
            thisNode = document.querySelector(`#tableRow${rowsInserted}`)
            thisNode.remove()
        }
        rowsInserted = 0
    } // end check for empty table
    for (let i =0; i<(tableData['drvPosition'].length); ++i){
        let thisRow = ""
        for (let keys of Object.keys(tableData)){
            thisRow +=`<td>${tableData[keys][i]}</td>`
        } // end get all values for that row out of my dictionary
        const tr = document.createElement('tr')
        tr.innerHTML = thisRow
        rowsInserted += 1
        tr.id = `tableRow${rowsInserted}`
        document.querySelector('#resultsTable').appendChild(tr)
    } // end for each key holding all values of that type (e.g. all names)
}