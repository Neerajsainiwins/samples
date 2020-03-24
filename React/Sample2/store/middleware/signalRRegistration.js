
import {
    JsonHubProtocol,
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel,
    HubConnection
} from '@aspnet/signalr'; // version 1.0.4
import { apiService } from '../../services/api.service';
import * as types from '../types';

const signalRConnection = new HubConnectionBuilder("http://localhost:port/signalr-Hub");



const getGlobalCodes = (date) => {
    return apiService.post('GETALLMODIFIEDGLOBALCODES', {  ModifiedDate: date, UserName: "abc" }).then(response => {
        if (response.Message && response.data.globalCodeMainResponse.totalRecords > 0) {
            perform action
            return response.data.globalCodeMainResponse;
        }

    }, error => {

    });

}


export default function signalRRegistration(store) {

    const signalRConnection = new HubConnectionBuilder("http://localhost:port/signalr-Hub");

    const connection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl("http://localhost:port/signalr-Hub", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .build();
    
    connection.start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :('));

        connection.on('sendToAll', function () {
                getGlobalCodes(latestRecordDate).then(modifiedData => {
                    store.dispatch({
                        type: types.GLOBAL_CODES_STATUS,
                        payload: modifiedData
                    });
                });
            
            
        });
}