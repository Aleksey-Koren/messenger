import {ISearchParams} from "../../components/messenger/edit-global-users/GlobalUsersListModal";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {stringIndexArrayToArray} from "../../model/stringIndexArray";

export class GlobalUsersSearchService {

    static filterGlobalUsers(params: ISearchParams, users: GlobalUser[]) {
        return users.filter(user => isUserMatchToSearchParams(user, params))
    }
}

function isUserMatchToSearchParams(user: GlobalUser, params: ISearchParams) {

    const idRegExp = new RegExp(params.id ? '^' + params.id : '^', 'i');
    const titleRegExp = new RegExp(params.title ? '^' + params.title : '^', 'i');
    return idRegExp.test(user.userId) && (params.title === '' ? true : stringIndexArrayToArray(user.titles).some(title => titleRegExp.test(title)));
}