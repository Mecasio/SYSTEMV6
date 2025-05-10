import {CollectionsBookmark, Description, EditNote } from "@mui/icons-material";
import React from "react";
import {Link} from 'react-router-dom';

const SystemDashboardPanel = () => {
    return (
        <div className="px-8 p-2 w-full ">
            <div className="flex">
                <div className="relative ">
                    <Link to={'/requirements_form'}>
                        <div className="bg-white border-4 p-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">REQUIREMENTS PANEL </button>
                    </Link>
                </div>

                <div className="relative">
                    <Link to={'/room_registration'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <Description className="text-maroon-500 " style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">ROOM FORM</button>
                    </Link>
                </div>
    
                <div className="relative">
                    <Link to={'/section_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <EditNote className="text-maroon-500 transform scale-[1.3] ml-1" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[18rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">SECTION PANEL FORM</button>
                    </Link>
                </div>
                
                <div className="relative">
                    <Link to={'/semester_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">SEMESTER PANEL FORM</button>
                    </Link>
                </div>
            </div>
            <div className="flex">
                <div className="relative ">
                    <Link to={'/change_grade_period'}>
                        <div className="bg-white border-4 p-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">CHANGE GRADING PERIOD</button>
                    </Link>
                </div>

                <div className="relative">
                    <Link to={'/year_update_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <Description className="text-maroon-500 " style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">YEAR UPDATE PANEL</button>
                    </Link>
                </div>
    
                <div className="relative">
                    <Link to={'/school_year_activator_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <EditNote className="text-maroon-500 transform scale-[1.3] ml-1" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[18rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">SHOOL YEAR ACTIVATOR PANEL</button>
                    </Link>
                </div>
                
                <div className="relative">
                    <Link to={'/year_level_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">YEAR LEVEL PANEL FORM</button>
                    </Link>
                </div>
            </div>
            <div className="flex">
                <div className="relative">
                    <Link to={'/year_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <EditNote className="text-maroon-500 transform scale-[1.3] ml-1" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">YEAR PANEL FORM</button>
                    </Link>
                </div>
                
                <div className="relative">
                    <Link to={'/school_year_panel'}>
                        <div className="bg-white p-4 border-4 rounded-lg border-solid border-maroon-500 absolute left-16 top-8 w-enough">
                            <CollectionsBookmark className="text-maroon-500" style={{fontSize: '2rem'}}/>
                        </div>
                        <button className="bg-white text-maroon-500 border-4 rounded-lg border-solid border-maroon-500 p-4 w-[16rem] rounded-md h-32 font-medium mr-3 mt-16 ml-8 flex items-end justify-center">SCHOOL YEAR PANEL</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SystemDashboardPanel;
