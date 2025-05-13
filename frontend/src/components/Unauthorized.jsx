import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{display: "flex", height:"85%", alignItems: "center"}}>
            <div style={{ textAlign: 'center'}}>
                <h1>Unauthorized Access</h1>
                <p>You do not have access to this page. <br />
                    Please contact the administrator
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;
