import React, { useState, useEffect } from "react";
import "./deal.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import ActivityLoader from "../../ActivityLoader/index";
import { GET, UPDATE } from "../../../services/httpClient";
import Snackbar from "../Snackbar/index";
import Button from "@mui/material/Button";
import RattingDialog from "../rattingDialog/index";

const Deals = () => {
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const [searched, setSearched] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getRecord();
  }, []);
  async function getRecord() {
    setLoading(true);
    let rows = await GET("/agency");
    if (rows) {
      setTimeout(function () {
        setRows(rows);
        setLoading(false);
      }, 3000);
    }
  }

  async function handleChange(row) {
    let { id, active } = row;
    setLoading(true);
    let change = await UPDATE("/agency/active", { id, active });
    if (change.code === 200) {
      setType("success");
      setOpen(true);
      setLoading(false);
      setSnackbarMessage(change?.message);
      getRecord();
    } else {
      setType("error");
      setOpen(true);
      setSnackbarMessage(change?.data.message);
      setLoading(false);
    }
  }
  return (
    <div className="home">
      <div className="listContainer">
        <TableContainer component={Paper} className="table">
          {isLoading && <ActivityLoader />}
          <Table sx={{ width: "850px" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">ID</TableCell>
                <TableCell className="tableCell">Destination</TableCell>
                <TableCell className="tableCell">Description</TableCell>
                <TableCell className="tableCell">Active</TableCell>
                <TableCell className="tableCell">Amount (Rs)</TableCell>
                <TableCell className="tableCell">Discount (Rs)</TableCell>
                <TableCell className="tableCell">Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tableCell">{row.id}</TableCell>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <img src={row.imageUrl} alt="" className="image" />
                      {row.destination}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell1">
                    {row.description}
                  </TableCell>
                  <TableCell className="tableCell">
                    <Checkbox
                      checked={row.active}
                      color="primary"
                      onChange={async () => {
                        await handleChange(row);
                      }}
                    />
                  </TableCell>
                  <TableCell className="tableCell">{row.amount}</TableCell>
                  <TableCell className="tableCell">{row.discount}</TableCell>
                  <TableCell className="tableCell">
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        setData(row.id);
                        setOpenDialog(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {open && (
          <Snackbar
            open={open}
            setOpen={setOpen}
            type={type}
            message={snackbarMessage}
          />
        )}
        {openDialog && (
          <RattingDialog
            openDialog={openDialog}
            dialog={setOpenDialog}
            data={data}
          />
        )}
      </div>
    </div>
  );
};

export default Deals;
