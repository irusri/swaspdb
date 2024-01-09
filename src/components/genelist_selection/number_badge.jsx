import React,{ useEffect,useState}   from "react";
import { observer } from "mobx-react";
import axios from 'axios';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Grid, Typography } from "@material-ui/core";

const number = observer(({ appState }) => {
  const [hintData, setHintData] = useState(null)

  useEffect(() => {  
    getData()
  }, [appState.GenIE.selectedDatabase]);

  const getData = async () => { 
    appState.GenIE.userID="_6jirazpb4";
    var url='https://api.plantgenie.org/genelist/get_all?name=plantgenie_genelist&fingerprint='+appState.GenIE.userID+'&table=beta_plantgenie_potra_v22';//+appState.GenIE.selectedDatabase;
    const res = await axios.get(url) ///genelist/get_all?name=plantgenie_genelist&fingerprint=_i2yd2mggm&table=beta_plantgenie_potra_v22  <span className="notificationcount"><span className="numbercount">{ hintData}</span></span> 
    
    console.log(res.data[0].genelist_flag)

    if(res.data[0]!==undefined && (res.data[0].gene_list)!==undefined ){
      if( res.data[0].genelist_flag==="1"){
      setHintData((res.data[0].gene_list).split(",").length)   
      appState.GenIE.activeGenelist=res.data[0];  
      }
     }else{
      setHintData(10)   
      appState.GenIE.activeGenelist="";
     }
  
}
 return (
  <>

<Grid>

<ButtonGroup
        orientation="vertical"
        spacing="10"
      >
{ hintData}
</ButtonGroup>
<Typography color="secondary" aria-label="edit">
{ hintData}
</Typography>
<br></br>
</Grid>

  </>
  );
});

export default number;
