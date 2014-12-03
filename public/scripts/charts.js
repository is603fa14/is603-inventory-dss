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

edu.umbc.is603.inventory.replacements = [];
edu.umbc.is603.inventory.replacementsGraphs = [];

var colorArray = [ "#009944", "#E60012", "#F08300","#EFEFEF"];
//Palette URL: http://colorschemedesigner.com/#3q62mWSE5w0w0

// dashboard charts
function showdashboard() {
     draw_pie_chart();
     draw_replacement(); 
}

function draw_pie_chart() {      
    var chart = AmCharts.makeChart("cost-bd", {
    "type": "serial",
    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
    "categoryField": "name",
    "colors": colorArray,
    "rotate": true,
      "legend": {
        "markerType": "circle",
        "position": "bottom",
        "marginRight": 0,       
        "autoMargins": false
    },
    "startDuration": 0,
    "categoryAxis": {
        "gridPosition": "start",
        "position": "left"
    },
    "trendLines": [],
    "graphs": edu.umbc.is603.inventory.replacementsGraphs,
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
    "dataProvider": edu.umbc.is603.inventory.replacements
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
    "startDuration": 0,
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
            "icon": '/amcharts/images/export.png',
            "format": 'png'
        }]
    }
});
}