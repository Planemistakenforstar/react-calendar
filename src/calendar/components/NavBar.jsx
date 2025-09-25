export const NavBar = () => {
  return (
    <div className="navbar navba-dark bg-dark mb-4 px-4">
        <span className="navbar-brand text-white">
            <i className="fas fa-calendar-alt "></i>
            &nbsp;
            Orestis Synefakoulis
        </span>

        <button className="btn btn-outline btn-danger">
            <i className="fas fa-sign-out-alt"></i>
            <span> Salir </span>
        </button>
    </div>
  )
}