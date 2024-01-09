import React from "react";
import appState from "../stores/store";
import { Button } from "@material-ui/core";
import HIGHCHARTS from "../pages/highcharts";
import EQTLTABLE from "./newtable";
import TREEMAP2 from "../pages/highchartTreemap";
import NETWORK from "../pages/network";
import {Grid} from "@material-ui/core";

const home = () => {
  return (<><br></br>&nbsp;&nbsp;&nbsp;&nbsp;
  <Grid container spacing={3}>
  <Grid key="oo" container item xs={6} spacing={2} style={{ display: "flex", justifyContent: "flex-start" }} direction="column">
  <EQTLTABLE key="b"  appState={appState}/> 
  </Grid> 
  <Grid key="aa" container item xs={6} spacing={2} direction="column">
  <TREEMAP2 key="d" appState={appState}/>
  </Grid>
  <Grid key="bb" container item xs={6} spacing={2} direction="column">
  <HIGHCHARTS key="d" appState={appState}/>
  </Grid>
  <Grid key="cc" container item xs={6} spacing={2} direction="column">
  <NETWORK key="d" appState={appState}/>
  </Grid>
  <Grid key="dd" container item xs={6} spacing={2} direction="column">
  </Grid> 
</Grid>  
</> )
}; 

export default home;
 