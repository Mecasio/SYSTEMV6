import {CollectionsBookmark, Description, EditNote } from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const AdmissionDashboardPanel = () => {
    return (
        <div className="p-2 px-10 w-full grid grid-cols-3">
           
           <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">ADMISSION</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">READMISSION</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">CLASS ROSTER</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">STUDENT REQUIREMENTS FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">STUDENT REGISTRATION FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">SHIFTING FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/course_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">COURSE TAGGING FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">DRAFT LOAD FORM</button>
                </Link>
            </div>

            <div className="relative">
                <Link to={'/program_tagging'}>
                    <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                        <CollectionsBookmark className="text-maroon-500 text-2xl"/>
                    </div>
                    <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-80 rounded-md h-32 font-medium mr-4 mt-16 ml-8 flex items-end justify-center">OFFICIAL LOAD FORM</button>
                </Link>
            </div>
        </div>

    )
}

export default AdmissionDashboardPanel