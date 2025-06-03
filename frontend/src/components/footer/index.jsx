import style from './footer.module.css';

function Footer() {
  return (
    <footer>
      <div className={style.container}>
        <div className={style.card}>
          <p>Entre em contato:</p>
          <a
            href="https://wa.me/554796502449?text=Oi%20Jana!%20Estou%20buscando%20uma%20arquiteta%20e%20queria%20conversar%20com%20você%20sobre%20os%20seus%20serviços."
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={style.imgFooter}
              src="/img/icons8-whatsapp.svg"
              alt="icone WhatsApp"
              title="Enviar Mensagem"
            />
          </a>
        </div>
        <div className={style.card}>
          <p>Me acompanhe no instagram</p>
          <a
            href="https://www.instagram.com/jana.possamai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={style.imgFooter}
              src="/img/icons8-instagram.svg"
              alt="icone Instagram"
              title="Acessar Instagram"
            />
          </a>
        </div>
      </div>
      <p className={style.footerText}>&copy; {new Date().getFullYear()} Arq-Janaina Possamai. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;
