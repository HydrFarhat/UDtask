import React, { useEffect, useState } from 'react'
import * as ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link, Switch } from 'react-router-dom';
import UserPage from './UserPage'
import { BiArrowBack } from 'react-icons/bi'
    ;
import AccessForbidden from './AccessForbidden';

const UserGrid = (props) => {

    const [showUserPage, setShowUserPage] = useState(false)
    const data = [
        { name: "test", email: "test" },
        { name: "test", email: "test" },
        { name: "test", email: "test" },
        { name: "test", email: "test" },
        { name: "test", email: "test" },
        { name: "test", email: "test" },

    ]
    const columns = [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true

        },
        // {
        //     name: "ViewUser",
        //     button: true,
        //     cell: (row) => (

        //         <Link to='/user'>
                
        //         <button
        //             className="btn btn-primary btn-xs"
        //             onClick={(e) => handleButtonClick(row, row.id)}
        //         >
        //             View
        //         </button>
        //         </Link>
        //     ),
        // },
     
      
    ];


    useEffect(() => {
        // axios.get("http://127.0.0.1:8000/users/get").then((data) => { console.log(data) })
        return () => {
        };
    }, []); // Empty dependency array means the effect only runs once on mount


    const handleButtonClick = (e, id) => {
        window.localStorage.setItem("user", JSON.stringify(e));
        console.log("Row Id", id);
    };


    const ExpandedComponent = (row) => {
        // return <CompanyInnerTable rec={row} data={props.records}/>
    }




    return (
        console.log(props.error),
        props.token?
        <div  >




            {/* <input className=" col-3  mt-2 mb-2 " value={props.q} type={"text"} onChange={(e) => props.setQ(e.target.value)} /> */}
            
                    <DataTable
                        columns={columns}
                        selectableRows
                        data={props.data.data}
                        fixedHeader
                        pagination
                        title="Users"
                    >
                    </DataTable>
            

        </div>
        :
        <div>
                    <AccessForbidden/>
        </div>
    );
};
export default UserGrid;
