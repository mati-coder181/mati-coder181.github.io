var data = {
  labels: [],
  datasets: []
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    layout: {
      padding: {
        top : 220,
        bottom : 20,
        right : 20,
      },
    },
    scales: {
      x :{
        grid: {
          borderColor: '#747272',
          color : '#747272',
        } 
      },
      y :{
        grid: {
          borderColor: '#747272',
          color : '#747272',
        } 
      }
    },
    fill: false,
      plugins: {
          legend:{
            display: true,
          },
          title: {
            display: true,
            text: 'Control Sat',
              font:{
                size: 16,
                family: 'Arial',
            },
          },
          subtitle:{
            display: true,
            text: 'Click to show',
          },
      }
  }
};


var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(document.getElementById('myChart'),config);

/* rgb random color generator */ 
function getRandomRgb() {
var num = Math.round(0xffffff * Math.random());
var r = num >> 16;
var g = num >> 8 & 255;
var b = num & 255;
return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

/* function to push datasets to the chart */     
function addData(myChart, label, color, color, data){        
  myChart.data.datasets.push({
    label: label,
    backgroundColor: color,                                    
    borderColor: color,
    data: data,
    hidden: true,
  });
  myChart.update();
}
/* function to push dates to the chart */ 
function addDates(x){
  myChart.config.data.labels.push(x);
  myChart.update();
}

