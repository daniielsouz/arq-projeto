import Logo from '../../img/LogoHeader.png'
import style from './header.module.css';
import { Link } from 'react-router-dom';


function Header() {
  return (
        <header className={style.headerContainer}>
                <img className={style.headerImg} src={Logo} alt='Logo Arq - Janaina Possamai' />
                <p  className={style.headerText}>CAU A309239-9</p>
            
            <nav>
                <ul className={style.headerList}>
                    <li className={style.headerListItens}><Link className={style.headerLinks} to="/">Página Inicial</Link></li>
                    <li className={style.headerListItens}><Link className={style.headerLinks} to="/Sobre">Sobre Mim</Link></li>
                    <li className={style.headerListItens}><Link className={style.headerLinks} to="/portifolio">Portifólio</Link></li>
                </ul>
            </nav>
        </header> 
    );
}

export default Header;