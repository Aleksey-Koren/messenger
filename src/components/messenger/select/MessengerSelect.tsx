import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {SingleValue} from "react-select";
import {AppState} from "../../../index";
import {Chat} from "../../../model/chat";
import {setCurrentChat} from "../../../redux/messenger/messengerActions";
import AsyncSelect from "react-select/async";


const MessengerSelect: React.FC<TProps> = (props) => {

    const [value, setValue] = useState<Chat | null>(null);

    async function generateOptions(input: string) {
        const filtered = props.chats?.filter(s => s.title!.includes(`${input}`));
        return filtered ? filtered : new Array<Chat>();
    }

    function onChange (value: SingleValue<Chat>) {

        props.setCurrentChat({id: value?.id!, title: value?.title!});
        setValue(null);
    }

    return (
        <AsyncSelect styles={{
            control: (base, state) => ({...base, backgroundColor: "grey", height: "50px"}),
            input: (base, state) => ({...base, color: "white"}),
            menu: (base, state) => ({...base, backgroundColor: "grey", color: "white", borderRadius: '20px'}),
            option: (base, state) => ({...base, color: state.isFocused ? "black" : "white", borderRadius: '20px'}),
            placeholder: (base, state) => ({...base, color: "white"})
        }}
                     loadOptions={generateOptions}
                     getOptionLabel={s => s.title!}
                     getOptionValue={s => s.toString()}
                     maxMenuHeight={500}
                     onChange={onChange}
                     value={value}
                     placeholder={'Search existing chat'}
                     noOptionsMessage={({inputValue}) => inputValue ? "No results found" : ""}
        />
    );
}


const mapStateToProps = (state: AppState) => ({
    chats: state.messenger.chats

})

const mapDispatchToProps = {
    setCurrentChat
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerSelect);