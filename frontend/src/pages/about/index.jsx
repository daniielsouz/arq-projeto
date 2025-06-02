import style from './about.module.css'
import Jana from './img/sobre-jana.jpg'
import AnimatedPage from "../../components/AnimatedPage"
import PageTitle from '../../components/PageTitle'

function About(){
    return(
        <AnimatedPage>
        <PageTitle title="Sobre - Janaina Possamai" />
        <section className='globalSection'>
        <h2 className='globalTitleSection'>Quem sou eu?</h2>
        <img className={style.aboutImg} src={Jana} alt='Janaina Possamai' />
        <p className={style.aboutText}>
            Sou a <strong>Jana</strong>, arquiteta por paixão. Minha trajetória na construção civil começou ainda durante a faculdade, atuando na área de engenharia civil. Com o tempo, mergulhei de vez na arquitetura, passando por dois escritórios onde pude ampliar meus conhecimentos e experiências. Em 2025, dei início à minha atuação com projetos próprios, desenvolvendo soluções completas em <strong>arquitetura, design de interiores e acompanhamento de obras</strong>, sempre com atenção aos detalhes, à funcionalidade e à essência de cada cliente.
        </p>
    </section>
    </AnimatedPage>
    )
}

export default About;