// import React from 'react';
// import { useTheme } from '../context/ThemeContext';

// const Navbar: React.FC = () => {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-light navbar-light'}`}>
//       <div className="container-fluid">
//         <span className="navbar-brand">Astromoney</span>
//         <button
//           className="btn btn-outline-primary"
//           onClick={toggleTheme}
//         >
//           {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
//         </button>
//       </div>
//     </nav>
//   );
// };
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import LoginButton from '../AuthLogic/LoginButton';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Full Navbar for Larger Screens */}
      <nav
        className={`navbar navbar-expand-lg ${theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-light navbar-light'} d-none d-lg-flex`}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Astromoney
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pricing
                </a>
              </li>
            </ul>
            <LoginButton />
            <button className="btn btn-outline-primary" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav
        className={`navbar fixed-bottom ${theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-light navbar-light'} d-flex d-lg-none`}
      >
        <div className="container-fluid d-flex justify-content-around">
          <a href="#" className="nav-link text-center">
            <i className="bi bi-house-fill"></i>
            <small>Home</small>
          </a>
          <a href="#" className="nav-link text-center">
            <i className="bi bi-grid-fill"></i>
            <small>Features</small>
          </a>
          <a href="#" className="nav-link text-center">
            <i className="bi bi-tags-fill"></i>
            <small>Pricing</small>
          </a>
          <a href="#" className="nav-link text-center">
            <i className="bi bi-person-fill"></i>
            <small>Profile</small>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
