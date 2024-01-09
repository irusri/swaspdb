import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import { observer } from "mobx-react";
import Link from '@material-ui/core/Link';


const columns = [
  { id: 'gene_id', label: 'Gene\u00a0ID', minWidth: 170 },
  { id: 'snp_id', label: 'SNP\u00a0ID', minWidth: 100 },
  {
    id: 'p_value',
    label: 'P-value',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'classification',
    label: 'classification',
    minWidth: 170,
    align: 'right',
  }
];

function createData(gene_id, snp_id, p_value, classification) {
  //const density = population / size;
  return { gene_id, snp_id, p_value, classification };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const rows2 = [
  createData('Frozen yoghurt', 159, 6.0),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Eclair', 262, 16.0),
  createData('Cupcake', 305, 3.7),
  createData('Gingerbread', 356, 16.0),
];

const eQTLTable = observer(({ appState }) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setValue] = React.useState([]);
  const preventDefault = (event) => event.preventDefault();

  useEffect(() => {   
    if (appState.GenIE.selectedSNP) {
        snp_info(appState.GenIE.selectedSNP)
    }
  }, [appState.GenIE.selectedSNP]); 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const snp_info = async (id) => { 
    const finalVar={"snp_id":id.toString()}
    appState.GenIE.selectedSNP=id.toString();
   //console.log(finalVar);
    var url='https://api.plantgenie.org/swaspdb/get_eqtl_by_snp_id'; 
    const data2 = await axios.post(url,finalVar)
    if(data2){
     
    appState.GenIE.selectedGenes =((data2.data).map((vars,index)=>vars.gene_id)).join(",");
    //console.log(data2.data)
  var finalA=[];
      for(var i=0;i<(data2.data).length;i++){
      if(data2.data!==null){
       var tmp_d={"gene_id":<Link target="_blank" href= {`https://beta.plantgenie.org/gene?id=${data2.data[i].gene_id}&species=potra`}   style={{ textDecoration: 'none', color: 'blue' }}  >{data2.data[i].gene_id}</Link>,"Desc":"Desc","snp_id":data2.data[i].snp_id,"p_value":data2.data[i].p_value,"classification":data2.data[i].classification}
        finalA.push(tmp_d) 
      }
      }
    //console.log(finalA)
    setValue(finalA) 
    }
}

return (
 <> { appState.GenIE.selectedGene}
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>


              
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell  key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper></>
  );
});
export default eQTLTable;