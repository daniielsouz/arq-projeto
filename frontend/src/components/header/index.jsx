import Logo from '../../img/LogoHeader.png'
import './header.module.css';
import { Link } from 'react-router-dom';


function Header() {
  return (
        <header>
                <img src={Logo} alt='Logo Arq - Janaina Possamai' />
                <p className='textos'>CAU A309239-9</p>
            
            <nav>
                <ul>
                    <li><Link  to="/">Página Inicial</Link></li>
                    <li><Link to="/Sobre">Sobre Mim</Link></li>
                    <li><Link to="/portifolio">Portifólio</Link></li>
                </ul>
            </nav>
        </header> 
    );
}

export default Header;