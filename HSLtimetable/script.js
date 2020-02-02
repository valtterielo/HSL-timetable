//this function will fetch timetables from a single bus station.
//to change the stop, modify stop id value in query.
// your bus stop's id can be found from reittiopas.hsl.fi just select your stop and check the url for id.
function getData() {
    fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
        {
            stop(id: "HSL:1130115") {
              name
                stoptimesWithoutPatterns {
                scheduledArrival
                headsign
                  trip{
                    route{
                      shortName
                    }
                  }
              }
            }  
          }
        `
            })
        }).then(res => res.json())
        .then(data => {

            document.getElementById("header").innerHTML = "Valittu pysäkki: " + data.data.stop.name;

            //creating array from retrieved json data
            let myArr = JSON.parse(JSON.stringify(data.data.stop.stoptimesWithoutPatterns));

            //screen can't show more than five different arrival times
            let printTimes = myArr.length;
            if (printTimes >= 5) {
                printTimes = 5
            }
            //making sure that the html table is empty before sending in new values
            $(".data").empty()
                //Going through the object array with jquery and adding values to the html file
            for (i = 0; i < printTimes; i++) {
                $(".data").append("<tr>");
                $(".data").append("<td class='time'>" + HHMM(myArr[i].scheduledArrival) + "</td>")
                $(".data").append("<td class='nro'>" + myArr[i].trip.route.shortName + "</td>")
                $(".data").append("<td class='sign'>" + myArr[i].headsign + "</td>")
                $(".data").append("</tr>")
            }
        })
}
//simple function for turning seconds into hours and minutes
function HHMM(seconds) {
    let H = Math.floor(seconds / 60 / 60)
    let M = seconds / 60 - H * 60
    if (H == 24) {
        H = 0
    } else if (H > 24) {
        H -= 24
    }
    if (H < 10) {
        H = "0" + H
    }
    if (M < 10) {
        M = "0" + M
    }
    return (H + ":" + M)
}
getData()
setInterval(getData, 30000)
