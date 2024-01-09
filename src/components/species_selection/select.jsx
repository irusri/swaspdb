import React, { useEffect,useState} from "react";
import { observer } from "mobx-react";
import Select from "react-select";
import TextField from '@material-ui/core/TextField';


const select = observer(({ appState }) => {

  const [selectdb, setSelctDB] = useState();

  useEffect(() => {
    setSelctDB(appState.GenIE.selectedDatabase)
  }, [appState.GenIE.selectedDatabase]);

  function setSelectedOption(e) {
    console.log("onchange fired")
    appState.GenIE.selectedDatabase = e;
    
  }

  
  return (
    <>
      <Select   style={{ width: "200px", border: '1px solid red' }} autoWidth="false" variant="outlined"
        onChange={(e) => setSelectedOption(e.phenotype_name)}
        options={appState.GenIE.db}
        value={selectdb}
        defaultValue={selectdb}
      // getOptionLabel={(option) => option.species + " " + option.version}
        getOptionLabel={(option) => option.phenotype_name}
        getOptionValue={(option) => option.phenotype_name}
        renderInput={params => (
          <TextField {...params} label="label" variant="outlined" />
        )}
      /> 
     
    </>
  );
});

export default select;
