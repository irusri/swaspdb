import React, { useEffect } from "react";
import {  Grid } from "@material-ui/core";
import { observer } from "mobx-react";
import Card from "./cards";


const grid = observer(({ appState }) => {
  useEffect(() => {
    appState.fetchDB();
  }, [appState]);
 
  return (
    <>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {appState.GenIE.db.map((elem) => (
          <Grid
            item
            xs={12}
            sm={2}
            md={3}
            key={appState.GenIE.db.indexOf(elem)}
          >
            <Card props={elem} />
          </Grid>
        ))}
      </Grid>
     
     
    </>
  );
});


export default grid;
