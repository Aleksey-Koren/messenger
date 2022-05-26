import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../index";
import {closeConfirmModal} from "../../redux/app/appActions";
import React from "react";
import ReportIcon from '@mui/icons-material/Report';
import style from './ConfirmModal.module.css'

const ConfirmModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle className={style.dialog__title}>
                <ReportIcon fontSize={'medium'} className={style.dialog__title_icon}/>
                Are you sure?
            </DialogTitle>

            <DialogContent className={style.dialog__content}>
                <span className={style.dialog__content_text}>{props.modalProps?.confirmMessage}</span>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => props.closeConfirmModal()} className={style.dialog__disagree_button}>
                    No
                </Button>
                <Button className={style.dialog__agree_button} onClick={() => {
                    props.closeConfirmModal();
                    props.modalProps.onConfirmModalAccept();
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.app.isConfirmModalOpen,
    modalProps: state.app.confirmModalProps
})

const mapDispatchToProps = {
    closeConfirmModal
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ConfirmModal);

