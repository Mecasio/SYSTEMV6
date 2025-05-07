import {CollectionsBookmark, Description, EditNote } from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const DepartmentManagement = () => {
    return (
        <div className="px-8 p-2 w-full flex">
           
           <div className="relative ">
                <Link to={'/select_college'}>
                    <div className="bg-white border-4 p-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">SCHEDULE PLOTTING FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/department_section_panel'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <Description className="text-maroon-500 " style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">DEPARTMENT SECTION PANEL</button>
                </Link>
            </div>
 
            <div className="relative">
                <Link to={'/department_registration'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <EditNote className="text-maroon-500 transform scale-[1.3] ml-1" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">DEPARTMENT PANEL</button>
                </Link>
            </div>
            <div className="relative">
                <Link to={'/department_room'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">DEPARTMENT ROOM PANEL</button>
                </Link>
            </div>
        </div>
    )
}
export default DepartmentManagement;