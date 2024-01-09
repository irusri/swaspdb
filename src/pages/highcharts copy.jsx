import React, { useEffect,useState}  from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { observer } from "mobx-react";
import axios from 'axios';

require('highcharts-data');


var SNPS;
var finalObj;
var initialPlot={
    "y" : {
      "vars" : ["rs1","rs2","rs3"],
      "smps": ["Chr","Pos","-log10(pValue)","Manhattan"],
      "data": [
        [1,1,0.038,1],
        [1,2,0.028,2],
        [1,3,0.543,3]]
    }
  };

const options = {
  title: {
    text: 'My chart'
  },
  series: [{
    data: [1, 2, 3]
  }]
}

const options3 = {
    title: {
      text: 'My chart2'
    },
    series: [{
      data: [1, 2, 3]
    }]
  }
 
const basename = [window.location.origin, window.location.pathname.split('/')[1]].join('/')
const options2 = {

chart: {
    type: "scatter",
    backgroundColor: "transparent"
   
},
plotOptions: {
    series: {
        marker: {
            symbol: 'circle'
        }
    }
},
title: {
    text: "Manhattan plot ",
    style: {
        fontSize: "35px"
    }
},
data: {
        csvURL: 'https://cors-anywhere.herokuapp.com/https://api.plantgenie.org/experiment/manh.csv'// basename + '/data/csv/manh.csv'
    },
yAxis: {
    labels: {
        style: {
            fontSize: "20px"
        }
    },
    title: { 
        enabled: false
    }
}
}
 
 
const App = observer(({ appState }) => {
    var XMLObject = {};
    const [graphData, setGraphData] = useState([]); 

    useEffect(() => {       
           
            console.log(graphData)
      }, []);

      const [selectdb, setSelctDB] = useState(); 
      let [plotData, setPlot] = useState(initialPlot); 
 
      
      useEffect(() => {  
        if (appState.GenIE.selectedDatabase) {
          getData()
        }
      }, [appState.GenIE.selectedDatabase]);
    
      const getData = async () => { 
      
        const finalVar={"phenotype_name":appState.GenIE.selectedDatabase}
        var url='https://api.plantgenie.org/swaspdb/get_snp_by_phenotype_names'; 
        const data2 = await axios.post(url,finalVar) 
    if(data2){
      
        
        var XMLObject2={} ;
        SNPS=JSON.parse(JSON.stringify(data2));
        //console.log(Object.values(SNPS.data).length)//.map((vars,index)=> [vars.position,vars.p_value]).join())  
        //console.log((SNPS.data)[1].map((vars,index)=> [vars.position,vars.p_value])) 

       
var tttkkk=[];
       for(var j=1;j<=Object.values(SNPS.data).length;j++){
       // XMLObject2["data"]=(SNPS.data)[j].map((vars,index)=> [vars.position,parseFloat(vars.p_value)]);
        //XMLObject2["name"]="chr_"+j;
        tttkkk.push({"data":(SNPS.data)[j].map((vars,index)=> [parseInt(vars.position),parseFloat(vars.p_value)]),"name":"Chr "+j})
        }
 

        //XMLObject["vars"]=(SNPS.data).map((vars,index)=>[vars.snp_id.split("_")[0],vars.snp_id.split("_")[1]])
        //XMLObject["smps"]=["Chr","Pos","-log10(pValue)","Manhattan"]
      //  XMLObject["data"]=(SNPS.data).map(getSNPID2);

         XMLObject = {
            title: {
              text: appState.GenIE.selectedDatabase
            },
            chart: {
                type: "scatter",
                backgroundColor: "transparent"
               
            },
            series: 
                tttkkk
            
            
          }
          setGraphData(XMLObject); 
//(SNPS.data).map(getSNPID2)
        //XMLObject2=(XMLObject).map(getSNPID3);
      //  console.log(XMLObject2);
        //XMLObject["name"]=(SNPS.data).map((vars,index)=>vars.snp_id.split("_")[0])
        //finalObj= {"y":XMLObject}
        //plotData={};
        //setPlot(finalObj);
        //console.log(SNPS)
        console.log(XMLObject);  
    }
    } 
    
    var chr_number_prev=1;
	var j=0;
    var tmpA=[];
    function getSNPID3(obj,index) {
        var chr_number=parseInt(obj.snp_id.replace("chr","").split("_")[0]);
        var snp_id=(obj.snp_id);
        var p_value=parseFloat((1-obj.p_value).toPrecision(4));
        if(chr_number!==chr_number_prev){
            j=1;
            console.log(chr_number,index,tmpA.length,snp_id); 
            tmpA=[];
        }else{
            j=j+1;
            tmpA.push(p_value)
        }
        chr_number_prev=chr_number;
        return obj;
    }
    
    var out="";
    var ooo={};
    function getSNPID2(obj,index) {
        var chr_length=[0,53234.430,23394.149,22153.688,20714.312,21719.336,23866.163,13889.780,16928.776,11968.568,19889.137,16810.303,13637.973,13701.538,16289.426,12861.315,13368.403,17528.992,13464.956,16374.649];
        var chr_number=parseInt(obj.snp_id.replace("chr","").split("_")[0]);
        var chr_position=parseInt(obj.snp_id.replace("chr","").split("_")[1])
        var p_value=parseFloat((1-obj.p_value).toPrecision(4));
        out=[chr_position+chr_length[chr_number-1]*1000]; 
        ooo["data"]=out;
        ooo["name"]=chr_number;
        return ooo;
    }



    var ttt = {};
    var tt=[];
    function getSNPID(obj,index) {
        var chr_length=[53234.430,23394.149,22153.688,20714.312,21719.336,23866.163,13889.780,16928.776,11968.568,19889.137,16810.303,13637.973,13701.538,16289.426,12861.315,13368.403,17528.992,13464.956,16374.649];
        var chr_number=parseInt(obj.snp_id.replace("chr","").split("_")[0]);
       
      
 
        (chr_number!==chr_number_prev)?j=1:j=j+1



     


    if(chr_number!==chr_number_prev || index===0){
        //console.log(tt,obj.snp_id.split("_")[0])
      //  j=1
        ttt["data"]=tt;
        ttt["name"]=obj.snp_id.split("_")[0]
        tt=[];
       
    }else{
        var final=[isNaN(chr_length[chr_number-2]*1000)?0:chr_length[chr_number-2]*1000+parseInt(obj.snp_id.split("_")[1]),parseFloat((1-obj.p_value).toPrecision(4))]

        tt.push(final)
       // j=j+1
    }

  

        chr_number_prev=chr_number;
        return ttt;
    }	
      
    const snp_info = async (id) => { 
     
    
    
      const finalVar={"snp_id":id.toString()}
    appState.GenIE.selectedSNP=id.toString();
      //console.log(finalVar);
      /*var url='https://api.plantgenie.org/swaspdb/get_eqtl_by_snp_id'; 
      const data2 = await axios.get(url,finalVar)
      if(data2){
        setIsLoading(false);
        console.log(data2)
      }*/
    }


return( <div>
  <HighchartsReact 
    highcharts={Highcharts}
    options={graphData}
  />
</div>);

});
export default App;