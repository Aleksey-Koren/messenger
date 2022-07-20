import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import ReportIcon from '@mui/icons-material/Report';
import style from './ConfirmModal.module.css';

interface IOwnProps {
    confirmFunction: () => void,
    text: string
}


const ConfirmModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={false}>
            <DialogTitle className={style.dialog__title}>
                <ReportIcon fontSize={'medium'} className={style.dialog__title_icon}/>
                Are you sure?
            </DialogTitle>

            <DialogContent className={style.dialog__content}>
                <span className={style.dialog__content_text}>{props.text}</span>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                }} className={style.dialog__disagree_button}>
                    No
                </Button>
                <Button className={style.dialog__agree_button} onClick={() => props.confirmFunction()}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: any, ownProps: IOwnProps) => ({
    confirmFunction: ownProps.confirmFunction,
    text: ownProps.text
})

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ConfirmModal);

