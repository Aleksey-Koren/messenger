import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel} from "@mui/material";
import {connect, ConnectedProps} from "react-redux";
import React, {useState} from "react";
import ReportIcon from '@mui/icons-material/Report';
import style from './ConfirmModal.module.css';

interface IOwnProps {
    confirmFunction: (data: string) => void,
    text: string,
    closeFunction: () => void
}


const ConfirmModal: React.FC<Props> = (props) => {

    const [valueCheckBox, setValueCheckBox] = useState(false)

    return (
        <Dialog open={true}>
            <DialogTitle className={style.dialog__title}>
                <ReportIcon fontSize={'medium'} className={style.dialog__title_icon}/>
                {props.text}
            </DialogTitle>

            <DialogContent className={style.dialog__content}>
                <FormControlLabel
                    control={
                        <Checkbox onChange={event => setValueCheckBox(event.target.checked)}/>
                    }
                    label="Delete all my messages. That action can't be undone"
                />
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => props.closeFunction()} className={style.dialog__disagree_button}>
                    No
                </Button>
                <Button className={style.dialog__agree_button} onClick={() => {
                    props.confirmFunction(valueCheckBox ? 'LEAVE_ROOM_WITH_DELETE_OWN_MESSAGES' : "LEAVE_ROOM");
                    props.closeFunction();
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: any, ownProps: IOwnProps) => ({
    confirmFunction: ownProps.confirmFunction,
    text: ownProps.text,
    closeFunction: ownProps.closeFunction
})

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ConfirmModal);

