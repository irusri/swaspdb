

import { Card, CardHeader, CardContent, Typography, Paper } from "@material-ui/core";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import appState from "../../stores/store";
import { observer }from "mobx-react";
 
const style = makeStyles({
    root: {
      minWidth: 25,     
      backgroundColor:"#f0f0f0",
      cursor:"pointer",
    },
    root2: {
        minWidth: 25,     
        backgroundColor:"#9EBF6D",
        cursor:"pointer",
      },
    bullet: {
      display: 'inline-block', 
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
     
      backgroundColor:"red",
    },
    pos: {
      marginBottom: 12,
      backgroundColor:"red", 
    },
  });

const card = observer(({ props }) => { 
    const test= (db ) => {
      appState.GenIE.selectedDatabase=db;
      appState.GenIE.selectedSpecies=props.phenotype_name;
    };
  return (
    <Card className={((appState.GenIE.selectedDatabase===props.phenotype_name)?style().root2:style().root)}  component={Paper}  onClick={() => test(props.phenotype_name)} >
      <CardHeader title={<i> {props.phenotype_name}  {props.version}</i>} />
      <CardContent > <i>{props.phenotype_name}</i> {props.description}
        <Typography  variant="h5" gutterBottom></Typography>
       
      </CardContent>
    </Card>
  );
});

export default card;
