import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styleProject from "../portifolio/portifolio.module.css";
import style from "./home.module.css";
import AnimatedPage from "../../components/AnimatedPage";
import PageTitle from "../../components/PageTitle";
import SEO from "../../components/SEO";
import ImgHome from "./img/imgHome.png";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos");
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <AnimatedPage>
      <SEO description="Janaina Possamai oferece projetos arquitetônicos personalizados, design de interiores sofisticado e consultoria especializada para transformar seus espaços com beleza, conforto e funcionalidade." />
      <PageTitle title="Arq - Janaina Possamai" />

      <section className={`${style.portfolioSection} globalSection`}>
        <div className={style.container}>
          <h2 className={style.homeTitle}>
            Projetando espaços que aliam <strong>estética</strong>,
            <strong> funcionalidade</strong> e{" "}
            <strong>qualidade de vida.</strong>
          </h2>
          <h4 className={style.homeText}>Do conceito à execução</h4>
        </div>
        <img className={style.imagem} src={ImgHome} alt="" />
      </section>

      <section className="globalSection">
        <h2 className="globalTitleSection">Serviços</h2>
        <div className={style.servicosContainer}>
          <div className={style.card}>
            <h3 className={style.cardTitle}>Projeto arquitetônico</h3>
            <p className={style.cardText}>
              Desenvolvimento completo do projeto da edificação, incluindo
              planta baixa, cortes, fachadas e detalhamentos técnicos.
            </p>
          </div>

          <div className={style.card}>
            <h3 className={style.cardTitle}>Design de Interiores</h3>
            <p className={style.cardText}>
              Escolha de mobiliário, iluminação, cores e materiais para
              transformar ambientes internos de forma funcional e estética.
            </p>
          </div>

          <div className={style.card}>
            <h3 className={style.cardTitle}>Consultoria</h3>
            <p className={style.cardText}>
              Apoio técnico e criativo para a execução de projetos, incluindo
              análise de viabilidade e sugestões de melhorias.
            </p>
          </div>
        </div>
        <span className={style.cardText}>
          E tudo o que você precisar para o seu projeto.
        </span>
      </section>
      <section className={`${styleProject.portfolioSection} globalSection`}>
        <h1 className="globalTitleSection">Últimos Projetos</h1>

        {!loading ? (
          projects.length === 0 ? (
            <p className={style.homeMessage}>
              Infelizmente ainda não temos nenhum projeto cadastrado.
            </p>
          ) : (
            <div className={style.containerLastProject}>
              {projects.map((project) => (
                <div key={project._id} className={styleProject.portfolioCard}>
                  <Link to={`/portifolio/${project._id}`}>
                    <img
                      className={styleProject.portfolioImg}
                      src={project.coverImg.url}
                      alt={project.nameProject}
                    />
                    <div className={styleProject.overlay}></div>
                  </Link>
                  <h2 className={styleProject.portfolioName}>
                    {project.nameProject}
                  </h2>
                </div>
              ))}
            </div>
          )
        ) : (
          <AnimatedPage>
            <p className={style.portfolioMessage}>Carregando projetos...</p>
          </AnimatedPage>
        )}
      </section>
    </AnimatedPage>
  );
}

export default Home;
