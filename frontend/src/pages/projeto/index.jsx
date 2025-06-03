import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import style from "./projeto.module.css";
import PageTitle from "../../components/PageTitle";

export default function Projeto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); 

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

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <p className={style.loading}>Carregando...</p>;

  return (
    <AnimatedPage>
      <PageTitle title={`${project.nameProject} - Janaina Possamai`} />
      <div className={style.container}>
        <h1 className={style.title}>{project.nameProject}</h1>
        <div className={style.containerImg}>
          {project.galeryImg.map((img, i) => (
            <div className={style.imageWrapper} key={i}>
              <img
                className={style.img}
                src={img.url}
                alt={`img-${i}`}
                onClick={() => handleImageClick(img)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className={style.modal} onClick={handleCloseModal}>
          <img src={selectedImage.url} alt="Imagem Ampliada" className={style.modalImage} />
        </div>
      )}
    </AnimatedPage>
  );
}
