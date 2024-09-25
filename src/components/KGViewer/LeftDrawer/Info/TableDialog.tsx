import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { height } from '@mui/system';
interface tableProps{
    open:boolean;
    handleClose:()=>void;
    selectedInfo:any;
}
export default function TableDialog({open, handleClose, selectedInfo}:tableProps) {

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {"详细信息"}
        </DialogTitle>
        <DialogContent>
        <TableContainer sx={{ width:"100%", maxHeight:"500px" }} component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
          {selectedInfo.map((item:any) => (
              <TableCell component="th" scope="row">
                {item.key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {selectedInfo.map((item:any) => (
              <TableCell align="right">
                {item.value}
              </TableCell>
            ))}
            </TableRow>
    
        </TableBody>
      </Table>
      </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}