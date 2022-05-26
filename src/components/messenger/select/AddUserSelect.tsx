import React, {Dispatch, SetStateAction, useState} from "react";
import {AppState} from "../../../index";
import AsyncSelect from "react-select/async";
import {connect, ConnectedProps} from "react-redux";
import {User} from "../../../model/User";

import {findUsersPerPage} from "../../../service/userService";
import {MultiValue} from "react-select";

const AddUserSelect: React.FC<TProps> = (props: TProps) => {

    const [isSearchable, setIsSearchable] = useState<boolean>(true)

    const onChange = (users: MultiValue<User>) => {
        props.setSelectedUsers([...users]);
        setIsSearchable(users.length < 10);
        console.log(users.length);
        console.log(isSearchable);
    }


    return (
        <AsyncSelect styles={{
            control: (base, state) => ({...base, borderRadius: '20px', backgroundColor: "grey"}),
            input: (base, state) => ({...base, color: "white"}),
            menu: (base, state) => ({...base, backgroundColor: "grey", color: "white", borderRadius: '20px'}),
            option: (base, state) => ({...base, color: state.isFocused ? "black" : "white", borderRadius: '20px'}),
            placeholder: (base, state) => ({...base, color: "white"})
        }}
                     loadOptions={promiseOptions(props.selectedRoom.id)}
                     isMulti
                     getOptionLabel={s => s.title}
                     getOptionValue={s => JSON.stringify(s)}
                     maxMenuHeight={300}
                     onChange={onChange}
                     placeholder={'Search...'}
                     noOptionsMessage={({inputValue}) => inputValue ? "No results found" : ""}
                     isSearchable={isSearchable}
        />
    );
}

function promiseOptions (roomId: number) {
    return (inputValue: string): Promise<User[]> => {
        return findUsersPerPage(0, 20, {title: inputValue, notInRoom: roomId}).then(s => s.data.content)
    }
}

interface OwnProps {
    setSelectedUsers:  Dispatch<SetStateAction<User[]>>;
    selectedUsers: User[];
    isDisabled: boolean;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
    selectedRoom: state.messenger.selectedRoom,
    selectedUsers: ownProps.selectedUsers,
    setSelectedUsers: ownProps.setSelectedUsers,
    isDisabled: ownProps.isDisabled,
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AddUserSelect);