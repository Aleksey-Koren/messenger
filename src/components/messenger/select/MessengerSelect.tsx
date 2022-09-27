import React, {SyntheticEvent, useMemo, useRef, useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {SingleValue} from "react-select";
import {AppState} from "../../../index";
import {Autocomplete, TextField} from "@mui/material";
import {getChatById} from "../../../redux/chats/chatsActions";

type Option = { id: string, label: string };

const MessengerSelect: React.FC<TProps> = (props) => {

    const [value, setValue] = useState<Option | null>(null);

    const options = useMemo(() => {
        const out: Option[] = [];
        for (let key in props.chats) {
            let option = props.chats[key];
            out.push({id: option.id as string, label: option.title as string});
        }
        return out;
    }, [props.chats])


    function onChange(event: SyntheticEvent, value: SingleValue<{ id: string }>) {
        const id = value?.id;

        setValue(null);
        if (!props.chats || !id) {
            return
        }
        for (let key in props.chats) {
            let chat = props.chats[key];
            if (chat.id === id) {
                props.getChatById(chat.id!)
                setValue(null);
                if (textInput.current) {
                    textInput.current.value = '';
                }
            }
        }
    }

    const textInput = useRef<HTMLInputElement>(null);

    return (
        <Autocomplete
            value={value}
            options={options}
            onChange={onChange}
            blurOnSelect
            clearOnBlur
            renderInput={(params) => <TextField {...params} label="Search existing chats"/>}
        />
    );
}


const mapStateToProps = (state: AppState) => ({
    chats: state.chats.chats
})

const mapDispatchToProps = {
    getChatById,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerSelect);