import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import { AnimatePresence } from 'framer-motion';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import Toast from '../../components/toast/Toast.jsx';
import style from './adm.module.css';

function Adm() {
  const [projetos, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [galeryFiles, setGaleryFiles] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', key: 0 });

  const imageFiles = galeryFiles.length > 1 ? 'imagens selecionadas' : 'imagem selecionada';

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/portifolio`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => {
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);


  function showToast(message, type = 'info') {
    setToast({ message, type, key: Date.now() });
  }

  function handleSelect(event) {
    const projectId = event.target.value;
    const selected = projetos.find(i => i._id === projectId);
    setSelectedProject(selected);
    setEditedName(selected?.nameProject || '');
  }

  useEffect(() => {
    if (selectedProject) {
      setEditedName(selectedProject.nameProject);
      setGaleryFiles([]);
      setIsEditingName(false);
    }
  }, [selectedProject]);

  function handleDelete(id) {
    setIsDeleting(true);
    const token = localStorage.getItem('token');
  fetch(`${import.meta.env.VITE_API_URL}/portifolio/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  })
      .then(res => {
        if (!res.ok) {
          console.error('Erro na resposta do delete:', res);
          throw new Error('Erro ao deletar');
        }
        return res.json();
      })
      .then(data => {
        setProjects(prev => prev.filter(proj => proj._id !== id));
        setSelectedProject(null);
        showToast(data.message, 'success');
      })
      .catch(err => {
        console.error('Erro ao executar handleDelete:', err);
        showToast('Erro ao excluir projeto', 'error');
      })
      .finally(() => setIsDeleting(false));
  }

  function handleDeleteImage(projectId, imageUrl) {
    const token = localStorage.getItem('token');
    const encodedUrl = encodeURIComponent(imageUrl);
    fetch(`${import.meta.env.VITE_API_URL}/portifolio/${projectId}/imagem?imageUrl=${encodedUrl}`, {
      method: 'DELETE',
      headers: {
      'Authorization': `Bearer ${token}`, 
    },
    })
      .then(res => {
        if (!res.ok) {
          console.error('Erro na resposta do delete imagem:', res);
          throw new Error('Erro ao apagar imagem');
        }
        return res.json();
      })
      .then(data => {
        showToast(data.message, 'success');
        setSelectedProject(prev => ({
          ...prev,
          galeryImg: Array.isArray(prev?.galeryImg)
            ? prev.galeryImg.filter(img => img.url !== imageUrl)
            : [],
        }));
      })
      .catch(err => {
        console.error('Erro ao executar handleDeleteImage:', err);
        showToast('Erro ao excluir imagem', 'error');
      });
  }

  function handleUploadGalery() {
    if (!selectedProject || galeryFiles.length === 0) {
      showToast('Nenhuma imagem selecionada', 'error');
      return;
    }

    const formData = new FormData();
    galeryFiles.forEach(file => formData.append('galeryImg', file));
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/portifolio/${selectedProject._id}/imagens`, {
      method: 'POST',
          headers: {
      'Authorization': `Bearer ${token}`  
    },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        showToast(data.message, 'success');
          setTimeout(() => {
    window.location.reload();
  }, 1000); 
})
      .catch(err => {
        console.error("Erro ao enviar imagens:", err);
        showToast("Erro ao enviar imagens.", 'error');
      });
  }

  function handleEditName() {
    
    if (!editedName.trim()) {
      showToast('Nome inválido.', 'error');
      return;
    }

    if (editedName === selectedProject.nameProject) {
      setIsEditingName(false);
      return;
    }
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/portifolio/${selectedProject._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nameProject: editedName }),
    })
      .then(res => {
        if (!res.ok) {
          console.error('Erro na resposta do edit name:', res);
          throw new Error('Erro ao editar nome');
        }
        return res.json();
      })
      .then(data => {
        showToast(data.message, 'success');
        setSelectedProject(prev => ({ ...prev, nameProject: editedName }));
        setProjects(prev =>
          prev.map(proj =>
            proj._id === selectedProject._id ? { ...proj, nameProject: editedName } : proj
          )
        );
        setIsEditingName(false);
      })
      .catch(err => {
        console.error('Erro ao editar nome:', err);
        showToast('Erro ao editar nome', 'error');
      });
  }

  return (
    <section className={`globalSection ${style.sectionAdm}`}>
      {isDeleting && <LoadingOverlay message={`Excluindo ${selectedProject.nameProject}`} />}
      <Toast key={toast.key} message={toast.message} type={toast.type} />
      <h2 className="globalTitleSection">Administrativo</h2>

      <div className={style.admContainer}>
        <div>
          <select
            className="globalInput"
            onChange={handleSelect}
            value={selectedProject?._id || ''}
          >
            <option disabled value="">Selecione o Projeto</option>
            {projetos.map(i => (
              <option key={i._id} value={i._id}>{i.nameProject}</option>
            ))}
          </select>
        </div>
        <div>
          <Link to="/adm/AdicionarProjeto">
            <img
              className={style.icon}
              src="/img/circle.svg"
              alt="Adicionar Projeto"
              title="Adicionar Projeto"
            />
          </Link>
        </div>
      </div>

      {selectedProject && (
        <div>
          <div className={style.divName}>
            {isEditingName ? (
              <>
                <input
                  className='globalInput'
                  value={editedName}
                  autoFocus
                  onChange={e => setEditedName(e.target.value)}
                />
                <img
                  className={style.icon}
                  src="/img/confirm.svg"
                  onClick={handleEditName}
                  title="Salvar nome"
                />
                <img
                  className={style.icon}
                  src="/img/cancelFile.svg"
                  onClick={() => {
                    setIsEditingName(false);
                    setEditedName(selectedProject.nameProject);
                  }}
                  title="Cancelar edição"
                />
              </>
            ) : (
              <>
                <h1 className={style.titleName}>{selectedProject.nameProject}</h1>
                <img
                  className={style.icon}
                  src="/img/edit.svg"
                  title="Editar Nome"
                  onClick={() => setIsEditingName(true)}
                />
              </>
            )}
            <img
              onClick={() => !isDeleting && handleDelete(selectedProject._id)}
              className={style.icon}
              src="/img/delete.svg"
              alt="Deletar"
              title="Deletar todo projeto"
            />
            <label htmlFor="addPhoto">
              <img className={style.icon} src="/img/addPhoto.svg" title="Adicionar Foto" />
            </label>
            <input
              hidden
              id="addPhoto"
              type="file"
              accept="image/*"
              multiple
              onChange={e => setGaleryFiles([...e.target.files])}
            />
            {galeryFiles.length > 0 && (
              <>
                <span className={style.imgSelected}>
                  {`${galeryFiles.length} ${imageFiles}`}
                </span>
                <img
                  className={style.icon}
                  src="/img/confirm.svg"
                  onClick={handleUploadGalery}
                  title={`Enviar ${imageFiles}`}
                />
                <img
                  className={style.icon}
                  src="/img/cancelFile.svg"
                  onClick={() => setGaleryFiles([])}
                  title="Cancelar Seleção"
                />
              </>
            )}
          </div>

          <div className={style.divItens}>
            <AnimatePresence>
              {(() => {
                try {
                  if (!Array.isArray(selectedProject.galeryImg)) {
                    console.error('galeryImg não é um array:', selectedProject.galeryImg);
                    return null;
                  }
                  return selectedProject.galeryImg.map((url, index) => (
                    <AnimatedPage key={`${selectedProject._id}-${index}`}>
                      <div className={style.divImg}>
                        <img
                          className={style.imgCustom}
                          src={url.url}
                          alt={`Imagem ${index}`}
                        />
                        {selectedProject.galeryImg.length === 1 ? (
                          <img
                            onClick={() => !isDeleting && handleDelete(selectedProject._id)}
                            className={style.icon}
                            src="/img/delete.svg"
                            alt="Deletar"
                            title="Deletar projeto"
                          />
                        ) : (
                          <img
                            onClick={() =>
                              handleDeleteImage(selectedProject._id, url.url)
                            }
                            className={style.icon}
                            src="/img/delete.svg"
                            alt="Deletar"
                            title={`Deletar imagem ${index + 1}`}
                          />
                        )}
                      </div>
                    </AnimatedPage>
                  ));
                } catch (error) {
                  console.error('Erro no map das imagens:', error);
                  return null;
                }
              })()}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}

export default Adm;
