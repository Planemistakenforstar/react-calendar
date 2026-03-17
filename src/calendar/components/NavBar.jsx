import { useAuthStore } from "../../hooks/useAuthStore"

export const NavBar = () => {

  const { startLogout, user } = useAuthStore();

  return (
    <div className="navbar navba-dark bg-dark mb-4 px-4">
        <span className="navbar-brand text-white">
            <i className="fas fa-calendar-alt "></i>
            &nbsp;
          {user.name}
        </span>

        <button className="btn btn-outline btn-danger" onClick={startLogout}>
            <i className="fas fa-sign-out-alt"></i>
            &nbsp;
            
            <span> Salir </span>
        </button>
    </div>
  )
}