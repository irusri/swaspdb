import React,{ useEffect,useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      // Default transform is "translate(14px, 20px) scale(1)""
      // This lines up the label with the initial cursor position in the input
      // after changing its padding-left.
      transform: "translate(34px, 20px) scale(1);"
    }
  },
  inputRoot: {
    color: "purple",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    }
  }
}));


const select = observer(({ appState }) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);

  useEffect(() => {   
    setValue(appState.GenIE.selectedDatabase)
  }, [appState.GenIE.selectedDatabase]);

  function setSelectedOption(e) {
   appState.fetchDB();
    appState.GenIE.selectedDatabase = e; 
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      classes={classes}
     value={value} 
      onChange={(e) => setSelectedOption(e.target.outerText)}
      options={appState.GenIE.db}
      getOptionLabel={option => (option.phenotype_name ? option.phenotype_name : "")}
      getOptionSelected={option => (option.phenotype_name ? option.phenotype_name : "")}
      defaultValue={appState.GenIE.selectedDatabase}
      style={{ width: 400 }}
      renderInput={(params) => <TextField {...params}  label={appState.GenIE.selectedDatabase} placeholder={appState.GenIE.selectedDatabase} variant="filled" fullWidth />}
    
    />
  );
});



export default select;