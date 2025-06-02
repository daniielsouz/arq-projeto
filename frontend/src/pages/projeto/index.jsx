import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import style from "./projeto.module.css";
import PageTitle from "../../components/PageTitle";

export default function Projeto() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/project/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error("Erro ao buscar projeto:", err));
  }, [id]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (!project) return <p className={style.loading}>Carregando...</p>;

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
