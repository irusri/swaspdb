import React,{ useEffect,useState}   from "react";
import { observer } from "mobx-react";
import TextField from '@material-ui/core/TextField';
import  Autocomplete from '@material-ui/lab/Autocomplete';


const select = observer(({ appState }) => {
 const [value, setValue] = useState(null);



  useEffect(() => {  
    setValue(appState.GenIE.selectedDatabase)
  }, [appState.GenIE.selectedDatabase]);

  function setSelectedOption(e) {
    console.log(e)
    appState.GenIE.selectedDatabase = e;
    
  }

  return (
    <>
 

     <Autocomplete
  id="combo-box-demo"
  options={appState.GenIE.db}
  getOptionLabel={option => (option.phenotype_name ? option.phenotype_name : "")}
  onChange={(e) => setSelectedOption(e.target.outerText)}
//defaultValue={appState.GenIE.selectedDatabase}
  //getOptionSelected={(option, value) =>
    //handleGetOptionSelected(option, value)
  //}
  // 
  //value={value}
 //value={appState.GenIE.selectedDatabase}
  style={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label={appState.GenIE.selectedDatabase} variant="outlined" fullWidth />}

  
 //value={value}  
 // defaultValue="beta_plantgenie_amtri_v10"
/>


    </>
  );
});

export default select;
