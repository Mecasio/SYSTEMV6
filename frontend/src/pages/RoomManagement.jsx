import React from "react";
import { Link } from 'react-router-dom';

const RoomManagement = () => {
    return (
        <div className="p-3">
           <Link to="/school_year_panel">
                <button className="bg-maroon-500 text-white p-4 rounded-md font-medium mr-4">School Year Panel</button>
           </Link>
           <Link to="/school_year_activator_panel">
                <button className="bg-maroon-500 text-white p-4 rounded-md font-medium mr-4">School Year Activator Panel</button>
           </Link>
           <Link to="/room_management">
                <button className="bg-maroon-500 text-white p-4 rounded-md font-medium">School Time Panel</button>
           </Link>
        </div>
    )
}

export default RoomManagement;