import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from './auth'

function Winery () {

    const [winery,setWinery] = useState(
        {}
    )
    const [staff, setStaff]=useState(
        false
    )

    const {id} = useParams()
    
    const { token } = useAuthContext();

    async function fetchWinery(){
        const url = `${process.env.REACT_APP_DJANGO_SERVICE}/api/wineries/${id}/`;

        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setWinery(data.winery)
        }

    }
    async function getCurrentUser() {
        const url = `${process.env.REACT_APP_DJANGO_SERVICE}/api/accounts/user/`;
        const response = await fetch(url, {
        credentials: 'include',
        });
        if (response.ok) {
        const user = await response.json();

        if (user.user.employee === true && user.user.winery === parseInt(id)){
            setStaff(true)
        }
        }
    }
    if (token) {
        getCurrentUser();
    }  
    
    useEffect( () => {fetchWinery(token)}, [])
    
    return (
        <>
        <div className='px-4 py-5 mt-0 my-5 text-center bg-transparent rounded opacity-100'>
            <div className='px-3'>
                <Link to={`/wineries/${id}/edit`} className={"btn btn-warning p-2 mb-1 mt-1" + (staff ? "": " d-none")}>Edit Winery Details</Link>
            </div>
            <h2 className='display-4'>Welcome to {winery.name}</h2>
            <div className="rounded mt-4" style={{ 
                backgroundImage: `url(${winery.url})`,
                backgroundRepeat: 'no-repeat',
                opacity: "100",
                backgroundSize: "cover",
                height: '500px',
                display: "block",
                boxShadow: "5px 5px 10px lightgrey"
                }}>
            </div>
            <h2 className='display-6'>About us</h2>
            <p className='px-4 py-5 bg-light mt-4 rounded'>{winery.description}</p>
        </div>
    </>    
    )
}

export default Winery