
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
    "theme": "none",
    "legend": {
        "useGraphSettings": true
    },
    "dataProvider": [ {
        "month": 'jan',
        "candy1": 3,
        "candy2": 4,
        "candy3": 1
    }, {
        "month": 'feb',
        "candy1": 5,
        "candy2": 1,
        "candy3": 2
    }, {
        "month": 'march',
        "candy1": 3,
        "candy2": 2,
        "candy3": 1
    }, {
        "month": 'jul',
        "candy1": 1,
        "candy2": 2,
        "candy3": 3
    }],
    "valueAxes": [{
        "integersOnly": true,
        "maximum": 6,
        "minimum": 1,
        "reversed": true,
        "axisAlpha": 0,
        "dashLength": 5,
        "gridCount": 10,
        "position": "left",
        "title": "Profit"
    }],
    "startDuration": 0.5,
    "graphs": [{
        "balloonText": "Profit in [[title]]  [[category]]: [[value]]",
        "bullet": "round",
        
        "title": "candy1",
        "valueField": "candy1",
        "fillAlphas": 0
    }, {
        "balloonText": "Profit in [[title]]  [[category]]: [[value]]",
        "bullet": "round",
        "title": "candy2",
        "valueField": "candy2",
        "fillAlphas": 0
    }, {
        "balloonText": "Profit in [[title]]  [[category]]: [[value]]",
        "bullet": "round",
        "title": "candy3",
        "valueField": "candy3",
        "fillAlphas": 0
    }],
    "chartCursor": {
        "cursorAlpha": 0,
        "cursorPosition": "mouse",
        "zoomable": false
    },
    "categoryField": "month",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "fillAlpha": 0.05,
        "fillColor": "#000000",
        "gridAlpha": 0,
        "position": "top"
    },
    "exportConfig": {
        "menuBottom": "15px",
        "menuRight": "15px",
        "menuItems": [{
            "icon": '/lib/3/images/export.png',
            "format": 'png'
        }]
    }
});


}