import {CollectionsBookmark, Description, EditNote } from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const CourseManagement = () => {
    return (
        <div className="px-8 p-2 w-full flex">
           
           <div className="relative ">
                <Link to={'/program_tagging'}>
                    <div className="bg-white border-4 p-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">PROGRAM TAGGING PANEL</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_panel'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <Description className="text-maroon-500 " style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">PROGRAM PANEL FORM</button>
                </Link>
            </div>
 
            <div className="relative">
                <Link to={'/curriculum_panel'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <EditNote className="text-maroon-500 transform scale-[1.3] ml-1" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">CREATE CURRICULUM</button>
                </Link>
            </div>
            <div className="relative">
                <Link to={'/course_panel'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">COURSE PANEL FORM</button>
                </Link>
            </div>
        </div>
    )
}
export default CourseManagement;