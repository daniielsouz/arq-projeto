import { useEffect, useRef, useState } from "react";
import style from "./portifolio.module.css";
import { Link } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import PageTitle from "../../components/PageTitle";
import ReactPaginate from "react-paginate";
import { AnimatePresence, motion } from "framer-motion";

export default function Portifolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  const galleryRef = useRef(null); 

  useEffect(() => {
    fetch("http://localhost:5000/portifolio")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar projetos:", err);
        setLoading(false);
      });
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const offset = currentPage * itemsPerPage;
  const paginatedItems = projects.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(projects.length / itemsPerPage);

  if (loading) {
    return (
      <AnimatedPage>
        <PageTitle title="Portifólio - Janaina Possamai" />
        <p className={style.portfolioMessage}>Carregando projetos...</p>
      </AnimatedPage>
    );
  }

  if (projects.length === 0) {
    return (
      <AnimatedPage>
        <PageTitle title="Portifólio - Janaina Possamai" />
        <p className={style.portfolioMessage}>Infelizmente ainda não temos nenhum projeto cadastrado.</p>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <PageTitle title="Portifólio - Janaina Possamai" />
      <section className={`${style.portfolioSection} globalSection`}>
        <h1 className="globalTitleSection" ref={galleryRef}>
          Portfólio
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={style.portfolioContainer}
          >
            {paginatedItems.map((project) => (
              <div key={project._id} className={style.portfolioCard}>
                <Link to={`/portifolio/${project._id}`}>
                  <img
                    className={style.portfolioImg}
                    src={project.coverImg.url}
                    alt={project.nameProject}
                  />
                  <div className={style.overlay}></div>
                </Link>
                <h2 className={style.portfolioName}>{project.nameProject}</h2>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Próximo"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={style.pagination}
          activeClassName={style.activePage}
          pageClassName={style.pageItem}
          previousClassName={style.pageItem}
          nextClassName={style.pageItem}
          breakClassName={style.pageItem}
        />
      </section>
    </AnimatedPage>
  );
}
