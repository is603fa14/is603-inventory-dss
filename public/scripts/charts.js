/**
 * Created by devel on 2/25/14.
 */



var colorArray = [ "#009944", "#E60012", "#F08300","#EFEFEF"];
//Palette URL: http://colorschemedesigner.com/#3q62mWSE5w0w0

//public variables and data arrays
var array = [
{
        "candy": "candy1",
        "profit": 501.9
    },
{
        "candy": "candy2",
        "profit": 301.9
    }, {
        "candy": "candy3",
        "profit": 201.1
    }, {
        "candy": "candy4",
        "profit": 165.8
    }];

// dashboard charts

function showdashboard() {
    console.log("Dashboard Chart");
    
     draw_pie_chart();
     draw_replacement(); 
   

}


function draw_pie_chart() {

            console.log("saul");

               
                var array = [
                {
                        "candy": "candy1",
                        "profit": 501.9
                    },
                {
                        "candy": "candy2",
                        "profit": 301.9
                    }, {
                        "candy": "candy3",
                        "profit": 201.1
                    }, {
                        "candy": "candy4",
                        "profit": 165.8
                    }];

                var chart = AmCharts.makeChart("total-spend", {
                    "type": "pie",
                    "theme": "none",
                    "dataProvider":array,
                    "valueField": "profit",
                    "colors": colorArray,
                    "titleField": "candy",
                    "exportConfig":{    
                      menuItems: [{
                      icon: '/lib/3/images/export.png',
                      format: 'png'   
                      }]  
                    }
                });

    
}

function draw_replacement() {

var chart = AmCharts.makeChart("cost-bd", {
    "type": "serial",
    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
    "categoryField": "candyf",
    "colors": colorArray,
    "rotate": true,
      "legend": {
        "markerType": "circle",
        "position": "bottom",
        "marginRight": 0,       
        "autoMargins": false
    },
    "startDuration": 1,
    "categoryAxis": {
        "gridPosition": "start",
        "position": "left"
    },
    "trendLines": [],
    "graphs": [
        {
            "balloonText": "candy:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-1",
            "lineAlpha": 0.2,
            "title": "candy",
            "type": "column",
            "valueField": "candy"
        },
        {
            "balloonText": "replacement:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-2",
            "lineAlpha": 0.2,
            "title": "replacement",
            "type": "column",
            "valueField": "replacement"
        }
    ],
    "guides": [],
    "valueAxes": [
        {
            "id": "ValueAxis-1",
            "position": "top",
            "axisAlpha": 0
        }
    ],
    "allLabels": [],
    "amExport": {
        "right": 20,
        "top": 20
    },
    "balloon": {},
    "titles": [],
    "dataProvider": [
        {
            "candyf": 'candy1',
            "candy": 23.5,
            "replacement": 18.1
        },
        {
            "candyf":'candy2',
            "candy": 26.2,
            "replacement": 22.8
        },
        {
            "candyf": 'candy3',
            "candy": 30.1,
            "replacement": 23.9
        },
        {
            "candyf":'candy4',
            "candy": 29.5,
            "replacement": 25.1
        },
        {
            "candyf": 'candy5',
            "candy": 24.6,
            "replacement": 25
        }
    ]
});
}