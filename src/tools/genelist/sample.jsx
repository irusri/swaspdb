import React from "react";
import PropTypes from "prop-types";

//import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import columns from "./columns";
import { TableCell, TableRow } from "@material-ui/core";



class Sample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      comments: null
    };
  }

  componentDidMount() {
    const url =
      "https://api.plantgenie.org/genesearch/get_all?name=beta_plantgenie_potra_v22&table=gene_info";
    const getDatas = fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data });
      })
      .catch((err) => console.log("error:", err));
  }

  handleClick = (value) => {
    console.log("value", value);
    const { id } = value;
    const url = `https://jsonplaceholder.typicode.com/posts/${id}/comments`;
    const getComments = fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ comments: data });
      })
      .catch((err) => console.log("error:", err));
  };

  render() {
   // const { classes } = this.props;
    const { data, comments } = this.state;
    console.log("comments", comments);
    const options = {
      filterType: "textField",
      fixedHeader: true,
      sort: true,
      search: true,
      selectableRows: "multiple",
      responsive: "scrollMaxHeight",
      rowsPerPage: 15,
      rowHove: true,
      selectableRowsHeader: true,
      expandableRows: false,
      expandableRowsOnClick: true,
      pagination:true,
     // serverSide: true,
      renderExpandableRow: (rowData, rowMeta) => {
        return (
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        );
      },
      onRowsClick: (rowData, rowMeta) => {
        console.log("rowData", rowData);
        this.handleClick(this.state.data[rowMeta.dataIndex]);
      },
      onRowsExpand: (curExpanded, allExpanded) => {
        console.log("rowExpand", curExpanded, allExpanded[0]);
        this.handleClick(this.state.data[allExpanded[0].dataIndex]);
      }
    };
    return (
      <React.Fragment>
        {data && (
          <MUIDataTable
            title={"Sample"}
            data={data}
            columns={columns}
            options={options}
          />
        )}
      </React.Fragment>
    );
  }
}

Sample.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Sample;
