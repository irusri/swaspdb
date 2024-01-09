import React, { useEffect,useState} from "react";
import { observer } from "mobx-react";
import axios from 'axios';
import CanvasXpressReact from 'canvasxpress-react';
import Progress from './progress';


var SNPS;
var finalObj;

const initialPlot={
  "y" : {
    "vars" : ["rs1","rs2","rs3"],
    "smps": ["Chr","Pos","-log10(pValue)","Manhattan"],
    "data": [
      [1,1,0.038,1],
      [1,2,0.028,2],
      [1,3,0.543,3]]
  }
};

const manhattan = observer(({ appState }) => {
  const [selectdb, setSelctDB] = useState(); 
  let [plotData, setPlot] = useState(initialPlot); 
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {  
    if (appState.GenIE.selectedDatabase) {
      getData()
    }
  }, [appState.GenIE.selectedDatabase,appState.GenIE.currentFDR]);

  const getData = async () => { 
    setIsLoading(true)
   // const finalVar={"phenotype_name":appState.GenIE.selectedDatabase}
    const finalVar={"phenotype_name":appState.GenIE.selectedDatabase,"fdr":1/Math.pow(10,appState.GenIE.currentFDR)}
    var url='https://api.plantgenie.org/swaspdb/get_snp_by_phenotype_name'; 
    const data2 = await axios.post(url,finalVar) 
if(data2){
    var XMLObject = {};
    SNPS=JSON.parse(JSON.stringify(data2));
    XMLObject["vars"]=(SNPS.data).map((vars,index)=>vars.snp_id)
    XMLObject["smps"]=["Chr","Pos","-log10(pValue)","Manhattan"]
    XMLObject["data"]=(SNPS.data).map(getSNPID)
    finalObj= {"y":XMLObject}
    plotData={};
    setPlot(finalObj);
   setIsLoading(false)
}
} 

  var config = {
    "graphType": "Scatter2D", 
    "highlightVar": ["rs13895","rs11846"],
    "manhattanMarkerChromosomeNumber": "Chr",
    "manhattanMarkerLogPValue": "-log10(pValue)",
    "manhattanMarkerPosition": "Pos",
    "scatterType": "manhattan",
    "title": appState.GenIE.selectedDatabase,
    "xAxisTitle":"Chromosome",
    "visiumPanning":true,
    "chromosomeLengths":
		[53234.430,23394.149,22153.688,20714.312,21719.336,23866.163,13889.780,16928.776,11968.568,19889.137,16810.303,13637.973,13701.538,16289.426,12861.315,13368.403,17528.992,13464.956,16374.649],
		
    "decorations" : {
      "line" : [{"color" : "rgb(255,0,0)","width" : 1,"y" : 7},{"color" : "rgb(0,0,255)","width" : 1,"y" : 5}],
      "marker" : [{"align" : "left","offsetX" : 5,"offsetY" : 0,"rotate" : -45,"sample" : ["Chr","Pos","-log10(pValue)"],
            "text" : "rs4064",
            "type" : "text",
            "variable" : "rs4064"
         }
      ]
   }
  };
 
var target = "canvas";
var evt = {
  "click": function (o, e, t) {
    if (o) {
      snp_info(o.y.vars);
    }
  }
}; 

var chr_number_prev=1;
	var j=0;
function getSNPID(obj,index) {
	var chr_number=parseInt(obj.snp_id.replace("chr","").split("_")[0]);
  (chr_number!==chr_number_prev)?j=1:j=j+1
	var final=[chr_number,j,parseFloat(1-obj.p_value).toPrecision(4),index+1]
	chr_number_prev=chr_number;
	return final;
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

function activateLasers(e) {

  
}


return (
 <>
    <div style={{
      marginLeft: '40%',
    }}>
      {isLoading && <Progress width={window.innerWidth} color="secondary" />} 
  </div>
  <CanvasXpressReact events={evt}  target={target} data={plotData} config={config} width={window.innerWidth/2} height={window.innerHeight/2} />
 
 </>
  );
});
export default manhattan;
