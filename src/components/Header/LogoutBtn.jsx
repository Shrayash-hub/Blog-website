import { useDispatch } from 'react-redux';
import authService from '../../api/authApi';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
    return (
        <button
            onClick={logoutHandler}
            className="rounded border border-white/40 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
            Logout
        </button>
    )
}

export default LogoutBtn
