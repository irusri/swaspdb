import React, { useEffect,useState}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { observer } from "mobx-react";
import Progress from './progress';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles((theme) => ({
 table: {
    minWidth: 650,
    width:'100%',
    maxHeight:"300px",
    marginLeft:"20px"
  },
}));

function createData(gene_id, p_value, classification) {
  return { gene_id, p_value, classification};
}

const rows2 = [
  createData('Frozen yoghurt', 159, 6.0),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Eclair', 262, 16.0),
  createData('Cupcake', 305, 3.7),
  createData('Gingerbread', 356, 16.0),
];

//export default function ScrollableTabsButtonAuto() {
const eQTLTable = observer(({ appState }) => {
  
  const classes = useStyles();
  const [rows, setValue] = React.useState([rows2]);
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {   
    if (appState.GenIE.selectedSNP) {
        snp_info(appState.GenIE.selectedSNP)
    }
  }, [appState.GenIE.selectedSNP]); 


  const snp_info = async (id) => { 
    setIsLoading(true);
    const finalVar={"snp_id":id.toString()}
    appState.GenIE.selectedSNP=id.toString();
   // console.log(finalVar);
    var url='https://api.plantgenie.org/swaspdb/get_eqtl_by_snp_id'; 
    const data2 = await axios.post(url,finalVar)
    if(data2){
    //  console.log(data2.data)
    appState.GenIE.selectedGenes =((data2.data).map((vars,index)=>vars.gene_id)).join(",");
       setValue(data2.data) 
       setIsLoading(false);
    }
}

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const handleChangeDense = (event) => {
  setDense(event.target.checked);
};

  return (
      <>
        <div style={{
      marginLeft: '10%',
    }}>
      {isLoading && <Progress width={window.innerWidth} color="secondary" />} 
  </div>
 <br></br><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SNP IDs</b><br></br>
   <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell><b>Gene ID</b></TableCell>
            <TableCell><b>Description</b></TableCell>
            <TableCell><b>ATG Description</b></TableCell>
            <TableCell><b>SNP ID</b></TableCell>
            <TableCell align="left"><b>P&nbsp;value</b></TableCell>
            <TableCell align="left"><b>Classification</b></TableCell>
            <TableCell align="left"><b>Selection</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => ( 
            <TableRow key={index}>
              <TableCell component="th" scope="row"><a target="_blank" href={"https://beta.plantgenie.org/gene?id="+row.gene_id}>{row.gene_id}</a></TableCell> 
              <TableCell>Description</TableCell>
              <TableCell>ATG Description</TableCell>
              <TableCell component="th" scope="row">{row.snp_id}</TableCell>
              <TableCell align="left">{row.p_value}</TableCell> 
              <TableCell align="left">{row.classification}</TableCell>
              <TableCell align="left">Yes/No</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </>

  );
});
export default eQTLTable;
