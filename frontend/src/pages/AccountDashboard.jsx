import {ListAlt, PersonAdd} from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const AccountDashboard = () => {
    return (
        <div className="px-8 p-2 w-full flex">
           
           <div className="relative ">
                <Link to={'/register_prof'}>
                    <div className="bg-white border-4 p-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <PersonAdd className="text-maroon-500" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">REGISTER ACCOUNTS</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/department_section_panel'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <ListAlt className="text-maroon-500 " style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[17rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">STUDENT INFO UPDATE FORM</button>
                </Link>
            </div>

        </div>
    )
}
export default AccountDashboard;