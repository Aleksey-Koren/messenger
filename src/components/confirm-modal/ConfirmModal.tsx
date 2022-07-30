import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import ReportIcon from '@mui/icons-material/Report';
import style from './ConfirmModal.module.css';
import {setIsConfirmModalOpen} from "../../redux/messenger-controls/messengerControlsActions";

interface IOwnProps {
    confirmFunction: () => void,
    text: string,
    closeFunction: () => void
}


const ConfirmModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={true}>
            <DialogTitle className={style.dialog__title}>
                <ReportIcon fontSize={'medium'} className={style.dialog__title_icon}/>
                Are you sure?
            </DialogTitle>

            <DialogContent className={style.dialog__content}>
                <span className={style.dialog__content_text}>{props.text}</span>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => props.closeFunction()} className={style.dialog__disagree_button}>
                    No
                </Button>
                <Button className={style.dialog__agree_button} onClick={() => {
                    props.confirmFunction();
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

