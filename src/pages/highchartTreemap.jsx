/* @flow */
import React, { useRef , useEffect,useState}  from "react";
import Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import treeMap from "highcharts/modules/treemap";
import axios from 'axios';
import HighchartsReact from "highcharts-react-official";
import addTreemapModule from 'highcharts/modules/treemap';
import { renderToString } from "react-dom/server";
import { observer } from "mobx-react";
import * as d3 from "d3";
//addTreemapModule(Highcharts);

var cum2=0;
if (typeof Highcharts === "object") {
    exporting(Highcharts);
    treeMap(Highcharts);
}
/*
if (typeof Highcharts === "object") {
  exporting(Highcharts);
  treeMap(Highcharts);
  //heatMap(Highcharts);
  Highcharts.setOptions({
    lang: {
      numericSymbols: ["K", "M", "B", "T"]
    },
    colors2: [
      "#ef9a9a",
      "#ffcc80",
      "#fff59d",
      "#a5d6a7",
      "#80cbc4",
      "#80deea",
      "#90caf9",
      "#b39ddb",
      "#ce93d8",
      "#f48fb1"
    ],

    colors: ["#ffffff","#ffbb00","#ffaa11","#ff9900","#ff7700","#ff5500","#ff3300","#cc2222","#aa0000"]
  });
}
*/
export const xIsInRange = (x, min, max) => {
  return (x - min) * (x - max) <= 0;
};

const data = [
  { id: "MF", name: "Sector one", color: "transparent" },
  {
    id: "1",
    name: "1",
    parent: "MF",
    value: 60,
    color: "rgb(199,32,58)"
  },
  {
    id: "2",
    name: "2",
    parent: "MF",
    value: 50,
    color: "rgb(133,52,71)"
  },
  { id: "sector_2", name: "Sector two", color: "transparent" },
  {
    id: "3",
    name: "3",
    parent: "sector_2",
    value: 60,
    color: "rgb(50,51,64)"
  },
  {
    id: "4",
    name: "4",
    parent: "sector_2",
    value: 90,
    color: "rgb(32,113,81)"
  },
  { id: "sector_3", name: "Sector three", color: "transparent" },
  {
    id: "5",
    name: "5",
    parent: "sector_3",
    value: 90,
    color: "rgb(50,51,64)"
  },
  {
    id: "6",
    name: "6",
    parent: "sector_3",
    value: 50,
    color: "rgb(133,52,71)"
  },
  { id: "sector_4", name: "Sector four", color: "transparent" },
  {
    id: "7",
    name: "7",
    parent: "sector_4",
    value: 60,
    color: "rgb(19,157,82)"
  },
  {
    id: "8",
    name: "8",
    parent: "sector_4",
    value: 90,
    color: "rgb(32,113,81)"
  },
  { id: "sector_5", name: "Sector five", color: "transparent" },
  {
    id: "9",
    name: "9",
    parent: "sector_5",
    value: 50,
    color: "rgb(19,157,82)"
  },
  {
    id: "10",
    name: "10",
    parent: "sector_5",
    value: 90,
    color: "rgb(133,52,71)"
  }
];



const SectionTitle = ({ data }) => {
const { level } = data.point.node;

  //console.log(level, data.point.options.name, "**");

//if(data.point.category===1 || data.point.category===0 || data.point.category===2){
//cum2+= (data.point.shapeArgs.width*data.point.shapeArgs.height)
//}



  if ((data.point.shapeArgs && level === 1 )  ) {
    //if(data.point.category===2){

    //}
    const { width } = data.point.shapeArgs;
    const { height } = data.point.shapeArgs;
  
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          top: `${-(height / 2)}px`,
          left: `${-(width / 2)}px`,
          opacity:1
       //   backgroundColor: "red"
        }}
      >
        <div style={{color:"red"}} className="title">{data.point.options.name}<br></br>{(data.point.value/cum).toPrecision(2)} </div>        
      </div>
       
    );
  }
  if (data.point.shapeArgs && level === 2) {
  
    return <div  >{data.point.options.id} <br></br>p-value: {((data.point.pvalue)).toPrecision(2)}<br></br>{data.point.options.name} <br></br>
    {data.point.options.nt} /{data.point.options.npat} 
    </div>;
  }
};
var cum=0;
const TreeMap = observer(({ appState }) => {
    const [graphData, setGraphData] = useState(); 

    
    useEffect(() => {  
        if (appState.GenIE.selectedDatabase) {
        //    console.log(data)
            getData();
           
          
        }
      }, [appState.GenIE.selectedGenes]);

      const getData = async () => { 
        const req = {
            "target":["go", "pfam","kegg"],
            "genes": (appState.GenIE.selectedGenes).split(","),
            "include_defs": false,
            "alpha": 1
        };
        const url='https://enrichment.plantgenie.org/potrav2/enrichment'; 
        const data = await axios.post(url,req) 
        if(data){
            let snpObj={};
            var ManhattanObject={};
           var ManhattanSeriesArray=[];


        
           snpObj=JSON.parse(JSON.stringify(data));
        //  console.log(snpObj)
          
          var colorDomain =[1,0.1,0.01,.001,.0001,.00001,.000001,.0000001,.00000001,0.000000001,0.0000000001];
          var colorRange = ["#ffffff","#ffbb00","#ffaa11","#ff9900","#ff7700","#ff5500","#ff3300","#cc2222","#aa0000"];

          	
var color = d3.scaleLinear()
.domain(colorDomain)
.range(colorRange);

ManhattanSeriesArray.push({ id: "MF", name: "Molecular Function", color: "transparent" });
ManhattanSeriesArray.push({ id: "BP", name: "Biological Process", color: "transparent" });
ManhattanSeriesArray.push({ id: "CC", name: "Cellular Component", color: "transparent" });
           for(var j=0;j<snpObj.data.go.length;j++){
  
              ManhattanSeriesArray.push({
                id:snpObj.data.go[j].id,
                name:snpObj.data.go[j].name,
                mpat:snpObj.data.go[j].padj,
                parent:snpObj.data.go[j].namespace,
                value:Math.abs(Math.log10(parseFloat(snpObj.data.go[j].pval.toPrecision(4)))),
                npat:snpObj.data.go[j].npat,
                nt:snpObj.data.go[j].nt,
                color:color(snpObj.data.go[j].pval),
  
                colorValue:Math.abs(Math.log10(parseFloat(snpObj.data.go[j].pval.toPrecision(4)))),
                pvalue:snpObj.data.go[j].pval
            })

          
              cum+=Math.abs(Math.log10(parseFloat(snpObj.data.go[j].pval.toPrecision(4))));
              
            
              //  ManhattanSeriesArray.push({"data":(snpObj.go)[j].map((vars,index)=> ({id:(vars)}) )})
           }
         
          //console.log(ManhattanSeriesArray)
       //   ManhattanSeriesArray.push({ id: "MF", name: "MF", color: "red" });
        //  ManhattanSeriesArray.push({ id: "BP", name: "BP", color: "green" });
         // ManhattanSeriesArray.push({ id: "CC", name: "CC", color: "transparent" });

        //   data=ManhattanSeriesArray;
        var datax = d3.nest().key(function(d) {return d.parent; }).key(function(d) { return d.name; }).key(function(d) { return d.id; }).entries(ManhattanSeriesArray);
       // console.log(datax)
        setGraphData(ManhattanSeriesArray)
       /*     snpObj=JSON.parse(JSON.stringify(data));
            console.log(snpObj)
            for(let j=1;j<=Object.values(snpObj.data).length;j++){
                if((snpObj.data)[j]!=undefined){
                ManhattanSeriesArray.push({"data":(snpObj.data)[j].map((vars,index)=> ({x:parseInt(vars.position),y:-(parseFloat(Math.log10(vars.p_value))).toFixed(3),name:vars.snp_id}) ),"name":"Chr "+j," allowPointSelect": true})
                }
            }
            ManhattanObject.series=ManhattanSeriesArray;
            setGraphData(ManhattanObject)  
          
        }*/
}
      } 






  const chart = useRef("market_map");

  return (
  
   
    <HighchartsReact
  //  width={window.innerWidth/2} height={window.innerHeight/2+100}
      highcharts={Highcharts}
      constructorType="chart"
      ref={chart}
      options={{
        height: (9 / 16 * 100) + '%',

        colorAxis: {
          minColor: '#FFFFFF',
          maxColor: "#FF0000",
          stops: [
            [0, '#ee4035'],
            [0.33, '#f37736'],
            [0.66, '#fdf498'],
            [0.99, '#7bc043']
        ]
      },

      tooltip: {
        style: {
          display: "none",
      }
    },    
    // 
        series: [
          {
           
            type: "treemap",
            alternateStartingDirection: true,
            allowDrillToNode: true,
            layoutAlgorithm: 'squarified',
          //  layoutAlgorithm: 'stripes',
         // layoutAlgorithm: 'squarified',
            levels: [
              {
                level: 1,
                showInLegend: true,
               /* overflow: "none",*/  
              
               dataLabels: {
                   enabled: true,
                   allowOverlap: false,
                   inside: true ,
                   verticalAlign: 'top',
                   align: 'top',
                   
                   style: {
                    textShadow: false ,
                    textOutline: false ,
                       fontSize: '10px',
                       color: '#0000000',
                       fontWeight: 'bold'
                   },
                   formatter() {
                  //   console.log(this)
                     if(this.point.value!==0){
                    return renderToString(<SectionTitle data={this} />);
                     }
                  }
               },
                borderWidth: 1,
                borderColor: "#ff0000"
              },
              {
                level: 2,
              
                dataLabels: {
                  enabled: true,
                  inside: true ,
                  useHTML: true,
                  verticalAlign: 'bottom',
                  align: 'bottom',
                  formatter() {
                    return renderToString(<SectionTitle data={this} />);
                  }
                },

                borderWidth: 1,
                borderColor: "#cccccc"
              }
            ],
            data: graphData,
            legendType: 'point'
          }
        ],
        colors: ["#ffffff","#ffbb00","#ffaa11","#ff9900","#ff7700","#ff5500","#ff3300","#cc2222","#aa0000"], 
        title: {
          text: "Enrichment",
          align: 'left'
        },
        subtitle: {
          text: ""
        }
      }}
      immutable
    />

  );
});

export default TreeMap;
