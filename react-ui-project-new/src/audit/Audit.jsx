import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from 'table/table';
import moment from 'moment'

import { userActions } from '_store';

export { Audit };

function Audit() {

    const logins = useSelector(x => x.users.item);
    const dispatch = useDispatch();
    
    let auth = localStorage.getItem('auth')
    let parsedAuth = JSON.parse(auth)

    useEffect(() => {
        dispatch(userActions.getAuditById(parsedAuth['role']));
    }, []);



    return (
        <div>
            <h1>Auditor Page</h1>
            {logins?.loading &&
                <tr>
                    <td colSpan="4" className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </td>
                </tr>
            }
            {logins && logins?.value && <Table data={logins?.value} rowsPerPage={5} />}

        </div>
    );
}
