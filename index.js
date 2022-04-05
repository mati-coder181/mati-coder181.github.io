import { InfluxDB } from 'https://unpkg.com/@influxdata/influxdb-client/dist/index.browser.mjs';

const url = "https://us-east-1-1.aws.cloud2.influxdata.com/";
const token = "JQnVtuHilTpq3vvtOKjOeWDwNLPvLYZR0zUJjyzZvoJtDAxUzm1TySE6k6jf2EDItP1AHNqWF9jXd7r7OdfwuA==";
const influxBucket = "telemetria";
const influxORG = "c06759430ed2b65d";
const queryAPI = new InfluxDB({ url, token }).getQueryApi(influxORG);

function getMeasurements() {
    const query = `import \"influxdata/influxdb/schema\" schema.measurements(bucket: \"${influxBucket}\")`
    fillListWithData('_m-list', query);
};

function getSelectedMeasurements() {
    clearList('#_f-list');
    const measurement_ = $("#_m-list").val();
    var query =
            `import \"influxdata/influxdb/schema\"
        schema.measurementFieldKeys(bucket: \"${influxBucket}\",
        measurement: \"${measurement_}\")
        |> yield(name: \"${measurement_}\")`
        fillListWithData('_f-list', query);

}

function fillListWithData(list_, query) {
    var list = document.getElementById(list_.toString()),
        option,
        result = [];

    const fluxObserver = {
        next(row, tableMeta) {
            result.push(tableMeta.toObject(row)._value);
        },
        error() {
            console.log('\nFinished ERROR')
        },
        complete() {
            result.forEach((m_) => {
                option = document.createElement('option');
                option.text = m_;
                list.appendChild(option);
            })
        }
    }
    queryAPI.queryRows(query, fluxObserver)
}
async function getData() {
    var results_ = [];
    var startDate = (new Date(document.getElementById("datepicker1").value).valueOf()) / 1000,
        endDate = (new Date(document.getElementById("datepicker2").value).valueOf()) / 1000;
    var selectedMeasurements = $("#_m-list").val();
    var selectedFields = $("#_f-list").val();
    var query = "";
        selectedFields.forEach((fields_) => {
            query = `from(bucket: \"${influxBucket}\")  
                    |> range(start: ${startDate}, stop: ${endDate} ) 
                    |> filter(fn: (r) => r[\"_measurement\"] == \"${selectedMeasurements}\")
                    |> filter(fn: (r) => r[\"_field\"] == \"${fields_}\")`;      
            results_.push(getGraphData(query));
        });
    return results_;
}

function clearList(list_) {
    $(list_.toString()).empty();
}

function getGraphData(query) {
    var result = [];
    const fluxObserver = {
        next(row, tableMeta) {
            result.push(tableMeta.toObject(row)._value);
        },
        error(error) {
            console.error(error)
        },
        complete() {    
            result.length > 0 ? result : console.log('empty data');
        }
    }
    queryAPI.queryRows(query, fluxObserver);
    return result;
};

async function listsPush() {
    var lists = $("#_f-list").val();
    await getData()
    .then( (result) => {
        for (let i = 0; i < lists.length; i++) {
            addData(myChart, lists[i], getRandomRgb(), getRandomRgb(), result[i]);
        }
    })
}

function datesPush(){
    var dates = [];
    var startDate = new Date(document.getElementById("datepicker1").value),
        endDate = new Date(document.getElementById("datepicker2").value);

    while (startDate < endDate){
        dates.push(startDate.toISOString().slice(0, 10));
        startDate.setDate(startDate.getDate()+1);
    };
    dates.forEach((date) => {
        addDates(date);
    });
}

function scrollToView(){
    const graph = document.getElementById('btnPopup');
    graph.scrollIntoView();
}


window.addEventListener('load', getMeasurements); 
document.getElementById('_m-list').addEventListener('click', getSelectedMeasurements);
document.getElementById('btnPopup').addEventListener('click', listsPush);
document.getElementById('btnPopup').addEventListener('click', datesPush);
document.getElementById('btnPopup').addEventListener('click', scrollToView);