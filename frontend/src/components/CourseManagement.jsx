import {CollectionsBookmark, Description, EditNote } from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const CourseManagement = () => {
    return (
        <div className="p-10 w-full flex items-center">
           
           <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-sand-500 p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-maroon-500 text-white p-4 w-64 rounded-md h-48 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">PROGRAM TAGGING PANEL</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_panel'}>
                    <div className="bg-sand-500 p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <Description className="text-maroon-500 text-xl "/>
                    </div>
                    <button className="bg-maroon-500 text-white p-4 w-64 rounded-md h-48 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">PROGRAM PANEL FORM</button>
                </Link>
            </div>
 
            <div className="relative">
                <Link to={'/curriculum_panel'}>
                    <div className="bg-sand-500 p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <EditNote className="text-maroon-500 transform scale-[1.4] ml-1"/>
                    </div>
                    <button className="bg-maroon-500 text-white p-4 w-64 rounded-md h-48 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">CREATE CURRICULUM</button>
                </Link>
            </div>
            <div className="relative">
                <Link to={'/course_panel'}>
                    <div className="bg-sand-500 p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-xl"/>
                    </div>
                    <button className="bg-maroon-500 text-white p-4 w-64 rounded-md h-48 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">COURSE PANEL FORM</button>
                </Link>
            </div>
        </div>
    )
}
export default CourseManagement;