import React, { useEffect,useState}  from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { observer } from "mobx-react";
import axios from 'axios';
import Progress from './progress';
//require('highcharts-data');

/**
* Display a temporary label on the chart
*/
function toast(chart, text) {
    chart.toast = chart.renderer.label(text, 100, 120)
        .attr({
            fill: Highcharts.getOptions().colors[0],
            padding: 10,
            r: 5,
            zIndex: 8
        })
        .css({
            color: '#FFFFFF'
        })
        .add();
    setTimeout(function () {
        chart.toast.fadeOut();
    }, 2000);
    setTimeout(function () {
        chart.toast = chart.toast.destroy();
    }, 2500);
}

/**
 * Custom selection handler that selects points and cancels the default zoom behaviour
 */
function selectPointsByDrag(e) {
    // Select points
    Highcharts.each(this.series, function (series) {
        Highcharts.each(series.points, function (point) {
            if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                    point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
                point.select(true, true);
            }
        });
});

    // Fire a custom event
    Highcharts.fireEvent(this, 'selectedpoints', { points: this.getSelectedPoints() });
    return false; // Don't zoom
}





/**
 * On click, unselect all points
 */
function unselectByClick() {
    var points = this.getSelectedPoints();
    if (points.length > 0) {
        Highcharts.each(points, function (point) {
            point.select(false);
        });
    }
   
}
var ManhattanSeriesArray=[];
var ManhattanObject = {};

const App = observer(({ appState }) => {
    const [graphData, setGraphData] = useState(); 
    const [isLoading, setIsLoading] = useState(true)
   // const [tmpFDR, setFDR] = useState([appState.GenIE.currentFDR]);

   /* Source object for Manhattan scatter plot */ 
ManhattanObject = {
    title: {
        text: appState.GenIE.selectedDatabase },
        yAxis: {
            labels: {
                style: {
                    fontSize: "10px"
                }
            },
        title: { 
            enabled: true,
            text:"-log10(pValue)"
        },     
    },     
    chart: {
        type: "scatter",
        backgroundColor: "transparent",
        events: {
            selection: selectPointsByDrag,
            selectedpoints: selectedPoints,
            click: unselectByClick
        },
        zoomType: 'xy'
        
    },
    tooltip:{
        crosshairs: true
    },  

    plotOptions: {
        series: {
            allowPointSelect: true,
            events: {
                click: function (event) {//selectedPoints(event);
                    console.log(event.point.name)
                    snp_info(event.point.name)}
            },

            tooltip: {
                headerFormat: '<b>SNP ID: {point.key}</b>', 
                pointFormat: '<br /><b>-log10(P-value) : {point.y}<br/>Position : {point.x}<br/>Pvalue: {point.z}</b>' 
            } 
        }
    },
    series: ManhattanSeriesArray
}

/**
 * The handler for a custom event, fired from selection event
 */
 var selectedSNPS=[];
function selectedPoints(e) {
 //   console.log(e.points)
     // Show a label
     selectedSNPS=[]; 
    for(var i=0;i<(e.points.length);i++){
     selectedSNPS.push(e.points[i].name)
    }
    snp_info(selectedSNPS)
     toast(this, '<b>' + e.points.length + ' points selected.</b>' +
         '<br>Click on empty space to deselect.');
 }

      useEffect(() => {  
        if (appState.GenIE.selectedDatabase) {
            ManhattanSeriesArray=[];setGraphData({});   
            getData()
            ManhattanObject.title.text=(appState.GenIE.selectedDatabase);
        }
      }, [appState.GenIE.selectedDatabase,appState.GenIE.currentFDR]);

      useEffect(() => {
          if(Highcharts.charts[0]){
           var series_length=Highcharts.charts[0].series.length
           for(var j=0;j<series_length;j++){
           var data_length=Highcharts.charts[0].series[j].data.length;
            for(var h=0;h<data_length;h++){
             // console.log(Highcharts.charts[0].series[j].data[h].name,appState.GenIE.selectedGene)
              
                if(Highcharts.charts[0].series[j].data[h].name===appState.GenIE.selectedGene){
                    
                  //  if(Highcharts.charts[0].series[j].data[h].name=== "chr19_12463147"){
                     //  console.log("sss")
                    Highcharts.charts[0].series[j].data[h].select(true,true);
//chart.series[0].data[i].select();chr6_157010
                    if(Highcharts.tooltip){
                   //console.log("sss"+appState.GenIE.selectedGene)
                        Highcharts.tooltip.refresh(Highcharts.charts[0].series[j].data[h]);  
                    }
                  // console.log(Highcharts.charts[0].series[j].data[h])
                }
            }
           }
          }
        },
      [appState.GenIE.selectedGene]);

    // get all phenotype_names
      const getData = async () => { 
        ManhattanSeriesArray=[];setGraphData({});   
        setIsLoading(true);
        const finalVar={"phenotype_name":appState.GenIE.selectedDatabase,"fdr":appState.GenIE.currentFDR}
        const url='https://api.plantgenie.org/swaspdb/get_snp_by_phenotype_names'; 
        const data = await axios.post(url,finalVar) 
        if(data){
            let snpObj={};
            ManhattanSeriesArray=[];setGraphData({}); 
            snpObj=JSON.parse(JSON.stringify(data));
            for(let j=1;j<=Object.values(snpObj.data).length;j++){
                if((snpObj.data)[j]!=undefined){
                ManhattanSeriesArray.push({"data":(snpObj.data)[j].map((vars,index)=> ({x:parseInt(vars.position),y:-(parseFloat(Math.log10(vars.p_value))).toFixed(3),name:vars.snp_id,z:vars.p_value}) ),"name":"Chr "+j," allowPointSelect": true})
                }
            }
            ManhattanObject.series=ManhattanSeriesArray;
            setGraphData(ManhattanObject)  
            setIsLoading(false);
        }
} 
      
const snp_info = async (id) => { 
        setIsLoading(true);
        const finalVar={"snp_id":id.toString()}
        appState.GenIE.selectedSNP=id.toString();
        const url='https://api.plantgenie.org/swaspdb/get_eqtl_by_snp_id'; 
        const data2 = await axios.post(url,finalVar)
        if(data2){
            setIsLoading(false);
        }
}
return(<><div style={{
    marginLeft: '40%',
  }}>
    {isLoading && <Progress width={window.innerWidth} color="secondary" />} 
</div>
<div><HighchartsReact   highcharts={Highcharts} options={graphData} allowChartUpdate="true" width={window.innerWidth/2} height={window.innerHeight/2}/></div></>);   
});
export default App;