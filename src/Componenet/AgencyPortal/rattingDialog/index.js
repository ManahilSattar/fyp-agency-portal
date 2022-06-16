import * as React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ActivityLoader from "../../ActivityLoader/index";
import { GET } from "../../../services/httpClient";

export default function RattingDialog(props) {
  const { dialog, openDialog, data } = props;
  const [open, setOpen] = React.useState(openDialog);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rows, setRow] = React.useState([]);
  const [count, setCount] = React.useState();
  const [value] = React.useState(data);
  const [avg, setAvg] = React.useState(0);

  React.useEffect(() => {
    getReview();
  }, []);
  const handleClose = () => {
    setOpen(false);
    dialog(false);
  };
  const getReview = async () => {
    setIsLoading(true);
    let data = await GET("/agency/review", { params: { adId: value } });
    if (data) {
      setCount(data.count);
      setRow(data.rows);
      setAvg(data.avg);
      setIsLoading(false);
    } else setRow(null);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Reviews</DialogTitle>
        <DialogContent>
          {!isLoading && (
            <Typography variant="h5" style={{ marginLeft: "5px" }}>
              Total Reviews {count}
            </Typography>
          )}
          <TableContainer component={Paper} sx={{ width: "550px" }}>
            {isLoading && <ActivityLoader />}
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Ad Id</TableCell>
                  <TableCell className="tableCell">User Name</TableCell>
                  <TableCell className="tableCell">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="tableCell">{row.addId}</TableCell>
                    <TableCell className="tableCell">
                      {row.user.firstName} {row.user.lastName}
                    </TableCell>
                    <TableCell className="tableCell">{row.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!isLoading && (
            <Typography variant="h5" style={{ marginLeft: "5px" }}>
              Average Reviews {avg ? avg / count : 0}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
