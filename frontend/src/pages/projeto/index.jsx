import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import style from "./projeto.module.css";
import PageTitle from "../../components/PageTitle";

export default function Projeto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/project/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Projeto não encontrado");
        return res.json();
      })
      .then(data => {
        if (!data || !data.nameProject) throw new Error("Projeto inválido");
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar projeto:", err);
        navigate("/portifolio/notfound", { replace: true });
      });
  }, [id, navigate]);

  const handleCloseModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex(prev =>
      prev === 0 ? project.galeryImg.length - 1 : prev - 1
    );
  }, [project]);

  const handleNext = useCallback(() => {
    setSelectedIndex(prev =>
      prev === project.galeryImg.length - 1 ? 0 : prev + 1
    );
  }, [project]);

  useEffect(() => {
    if (selectedIndex !== null) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") handlePrev();
        else if (e.key === "ArrowRight") handleNext();
        else if (e.key === "Escape") handleCloseModal();
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedIndex, handlePrev, handleNext, handleCloseModal]);


  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const delta = touchStartX.current - touchEndX.current;
      if (delta > 50) handleNext(); 
      else if (delta < -50) handlePrev(); 
    }
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  if (loading) return <p className={style.loading}>Carregando...</p>;

  const selectedImage =
    selectedIndex !== null ? project?.galeryImg?.[selectedIndex] : null;

  return (
    <AnimatedPage>
      <PageTitle title={`${project.nameProject} - Janaina Possamai`} />
      <div className={style.container}>
        <h1 className={style.title}>{project.nameProject}</h1>
        <div className={style.containerImg}>
          {project?.galeryImg?.map((img, i) => (
            <div className={style.imageWrapper} key={i}>
              <img
                className={style.img}
                src={img.url}
                alt={`img-${i}`}
                onClick={() => handleImageClick(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className={style.modal}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className={style.navegationImg} onClick={(e) => { e.stopPropagation(); handlePrev(); }}>{`<`}</button>
          <img
            src={selectedImage.url}
            alt="Imagem Ampliada"
            className={style.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={style.navegationImg} onClick={(e) => { e.stopPropagation(); handleNext(); }}>{`>`}</button>
        </div>
      )}
    </AnimatedPage>
  );
}
