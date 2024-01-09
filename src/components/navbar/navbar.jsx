import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import appState from "../../stores/store";
import {AppBar,Toolbar,Typography} from '@material-ui/core';
//import AC from "../species_selection/autocomplete";     <AC appState={appState}/>  &nbsp; 
import SELECT2 from "../genelist_selection/number_badge";
//import SELECT from "../species_selection/select";   <SELECT appState={appState}/> 
import AC1 from "../species_selection/a";
import AC2 from "../species_selection/reactautocompletesearch";
import AC3 from "../species_selection/autoC";
import SLIDER from '../../pages/slider';
import Badge from '@material-ui/core/Badge';


const useStyles = makeStyles((theme) => ({ 
	root: {
	  flexGrow: 1,
	},
	menuButton: {
	  marginRight: theme.spacing(1), 
	},
	title: {
	  flexGrow: 1, 
	},
  }));

const Navbar = () => {
	const classes = useStyles();
  const circle = <div className={classes.shape} />;

  return (
<>

<AppBar  style ={{padding:'0px,0px,0px,0px',display: 'block'}}  color="inherit" position="sticky">

  <Toolbar>
  {/*  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <MenuIcon /><AC2 appState={appState}/>
    </IconButton>*/} 
    <Typography variant="h6" className={classes.title}>
       <AC1 appState={appState} />
      
  </Typography>
  
  <AC3 appState={appState}/>
      {/*  <LinkButton color="primary"  component={Link}   onClick={toggle}  to="/">Home</LinkButton>
    <LinkButton  color="inherit"  component={Link}   onClick={toggle}  to="/resume/">Tools</LinkButton>*/} 
           {/*    <LinkButton  color="inherit"  component={Link}   onClick={toggle} to="/api/">API</LinkButton> */} 
          {/*    <LinkButton  color="inherit"  component={Link}   onClick={toggle} to="/api2/">Internal</LinkButton>  
          <LinkButton color="inherit"  component={Link}   onClick={toggle}  to="/Test/">External</LinkButton>
<SELECT2 appState={appState} /> */} 



        <SLIDER appState={appState} />

        <SELECT2 appState={appState}/>

  </Toolbar>
  
</AppBar>




    </>
  )
}

export default Navbar; 
