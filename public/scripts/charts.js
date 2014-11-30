
var edu = { umbc: { is603: { inventory: { } } } };

edu.umbc.is603.inventory.products = [];
edu.umbc.is603.inventory.productsGraphs = [];
edu.umbc.is603.inventory.productsAxes = [{
    "integersOnly": true,
    "maximum": 100,
    "minimum": 1,
    "axisAlpha": 0,
    "dashLength": 5,
    "gridCount": 10,
    "position": "left",
    "title": "Quantity"
}];

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

                var chart = AmCharts.makeChart("cost-bd", {
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

    var chart = AmCharts.makeChart("total-spend", {
    "type": "serial",
    "theme": "none",
    "legend": {
        "useGraphSettings": true
    },
    "dataProvider": edu.umbc.is603.inventory.products,
    "valueAxes": edu.umbc.is603.inventory.productsAxes,
    "startDuration": 0.5,
    "graphs": edu.umbc.is603.inventory.productsGraphs,
    "chartCursor": {
        "cursorAlpha": 0,
        "cursorPosition": "mouse",
        "zoomable": false
    },
    "categoryField": "week",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "fillAlpha": 0.05,
        "fillColor": "#000000",
        "gridAlpha": 0,
        "position": "bottom",
        "title": "Week"
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