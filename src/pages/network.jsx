import React, { useState,useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { observer } from "mobx-react";
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';

const network = observer(({ appState }) => {
//export default function App() {
  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("400px");

  const [graphData, setGraphData] = useState({
    nodes: [
      { data: { id: "1", label: "gene 1", type: "ip" } },
      { data: { id: "2", label: "gene 2", type: "ip" } },
      { data: { id: "3", label: "gene 3", type: "ip" } },
      { data: { id: "4", label: "gene 4", type: "ip" } }
     
    ],
    edges: [
      {
        data: { source: "1", target: "2", label: "Node2" }
      },
      {
        data: { source: "3", target: "2", label: "Node4" }
      },
      {
        data: { source: "3", target: "1", label: "Node5" }
      }
    ]
  });


  const [graphData2, setGraphData2] = useState(); 

    
    useEffect(() => {  
        if (appState.GenIE.selectedDatabase) {
            getData();
          
          
        }
      }, [appState.GenIE.selectedGenes]);

      const getData = async () => { 
        const req = {"private_default_gene_ids": appState.GenIE.selectedGenes,
          "network": "Bud",
          "name": "swasp_db",
          "table":"network",
          "max_connections":10000,
          "genes_expand":"false",
          "expand": 1.281551563277035,
          "reload":false,
          "fingerprint":"_6jirazpb4"
      };
        const url='https://api.plantgenie.org/network/network2'; 
        const data = await axios.post(url, req)  
        if(data){
          if(data.data.network!==undefined){
            setGraphData(data.data.network);
          }
        //  setGraphData(data.data.network);
        } 
      }


  const layout = {
    name: "concentric",
   // fit: true, 
     circle: true,
    directed: true,
    padding: 50,
    // spacingFactor: 1.5,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  };

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#9EBF6D",
        width: 30,
        height: 30,
        label: "data(name)",
      
        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        color: "black",
        fontSize: 10
      }
    },
   {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 50,
        height: 50,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "rgb(158, 191, 109);",
        "target-arrow-color": "rgb(158, 191, 109);",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];

  let myCyRef;


//(appState.GenIE.selectedGene==="data(name)"")?"rgb(158, 191, 109)":


  
  return (
    <>
   
      <div>
      <InputLabel htmlFor="my-input">&nbsp;&nbsp;&nbsp;<b>exNet</b></InputLabel>

        <div
          style={{
            border: "0px solid",
            backgroundColor: "#fff"
          }}
        >
       
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(graphData)}
             pan={{ x: 500, y: 200 }}
            style={{ width: width, height: height }}
           // zoomingEnabled={true}
            maxZoom={1}
            minZoom={0.1}
            //autounselectify={false} {(appState.GenIE.selectedGenes)?appState.GenIE.selectedGenes:"t"}
           // boxSelectionEnabled={false}
           layout={{
            animate: true,
            animationDuration: undefined,
            animationEasing: undefined,
            boundingBox: undefined,
            componentSpacing: 40,
            coolingFactor: 0.99,
            fit: true,
            gravity: 1,
            initialTemp: 1000,
            minTemp: 1.0,
            name: 'cose',
            nestingFactor: 1.2,
            nodeDimensionsIncludeLabels: false,
            nodeOverlap: 4,
            numIter: 1000,
            padding: 30,
            position(node) {
                return { row: node.data('row'), col: node.data('col') }
            },
            randomize: true,
            refresh: 20,
          }}
            stylesheet={styleSheet}
            cy={cy => {
              myCyRef = cy;
              cy.unbind("tap"); 
              //console.log("EVT", cy);

              cy.on("tap", "node", evt => {
                var node = evt.target;
              //  console.log("EVT", evt);
              appState.GenIE.selectedGene=node.data().name
               // console.log("TARGET", node.data().name);
                //console.log("TARGET TYPE", typeof node[0]);
              });
            }}
          //  abc={console.log("myCyRef", myCyRef)
           // }
          />
        </div>
      </div>
    </>
  );
});
export default network; 