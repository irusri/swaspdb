import React , { useEffect,useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { observer } from "mobx-react";


function valueLabelFormat(value) {
  const [coefficient, exponent] = value
    .toExponential()
    .split('e')
    .map((item) => Number(item));
  return `${Math.round(coefficient)}e^${exponent}`;
}

const slider = observer(({ appState }) => {

  const [value, setValue] = React.useState([]);
  useEffect(() => {  
    if (appState.GenIE.currentFDR) {
        setValue(appState.GenIE.currentFDR);
    }
  }, [appState.GenIE.currentFDR]);


  const handleChange = (event, newValue) => {
   setValue(newValue);
   appState.GenIE.currentFDR=newValue; 
   // appState.GenIE.currentFDR=1/Math.pow(10, newValue)
  //  console.group(appState.GenIE.currentFDR)
  };
 
  return (
    <div>
    
      <Typography id="non-linear-slider" gutterBottom>
       Change the slider to filter Manhattan plot by FDR
      </Typography>
      <Slider
        value={value} 
        min={0.5}
        step={.01}
        max={.9} 
      //scale={(x) => 1/Math.pow(10, x)} 
      // getAriaValueText={valueLabelFormat}
      // valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
    </div>
  );

});
export default slider;