import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position:'absolute',
    top:'0px',
    zIndex:'1000000000',
    left:'0px',
  },
}));

export default function LinearIndeterminate() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LinearProgress color="secondary"  /> 
    </div>
  );
}