import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Navbar() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout =() =>{
        logout()
        navigate('/login')
    }

    return (
        <nav className='bg-gray-900 p-4 text-white flex justify-between items-center'>
            <Link to='/' className='text-2xl font-bold'>JobBoard</Link>
            <div className='flex gap-4 items-center'>
                {!user?(
                    <>
                        <Link to='/login' className='hover:underline'>Login</Link>
                        <Link to='/register' className='hover:underline'>register</Link>
                    </>
                    ) : (
                        <>
                            <span className='text-sm hidden sm:block font-semibold mr-4'>Welcome, {user.name}</span>
                            {user.role === 'employer'?(<>
                                <Link to='/dashboard/employer' className='hover:underline font-bold mr-2'>Dashboard</Link>
                                <Link to='/contact' className='hover:underline font-bold mr-2'>Contact Us</Link>
                                    <Link to='/about' className='hover:underline font-bold mr-2'>About Us</Link>
                            </>
                            ):(
                                <>
                                    <Link to='/dashboard/seeker' className='hover:underline font-bold mr-2'>Dashboard</Link>
                                    <Link to='/contact' className='hover:underline font-bold mr-2'>Contact Us</Link>
                                    <Link to='/about' className='hover:underline font-bold mr-2'>About Us</Link>
                                </>
                            )
                                }

                            <button onClick={handleLogout} className='bg-red-500 px-4 py-2 rounder hover:bg-red-800  rounded-full transition mr-5 '>Logout</button>
                        </>
                    )
                }
            </div>
        </nav>
    )

}