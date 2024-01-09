import React,{ useState,useEffect} from "react";
import "./reactautocompletesearch.css";
import { observer } from "mobx-react";
import Autocomplete  from "./autoC";

const Autocompletex = observer(({ appState }) => {
  //const [value, setValue] = useState();
  //useEffect(() => {
   //console.log("sss"+value)
  //})
return (
    <Autocomplete onChange={(val) => console.log(val)} />
   );
});

export default Autocompletex;