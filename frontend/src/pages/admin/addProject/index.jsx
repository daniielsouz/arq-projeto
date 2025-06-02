import { useState } from 'react';
import style from './addProject.module.css';
import styleAdm from '../adm.module.css';
import AnimatedPage from '../../../components/AnimatedPage';
import PageTitle from '../../../components/PageTitle';
import LoadingOverlay from '../../../components/loading/LoadingOverlay';
import Toast from '../../../components/toast/Toast';
import { Link } from 'react-router-dom';

export default function Adm() {
  const [toast, setToast] = useState({ message: '', type: 'info', key: 0 });
  const [formData, setFormData] = useState({
    nameProject: '',
    coverImg: null,
    galeryImg: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function showToast(message, type = 'info') {
    setToast({ message, type, key: Date.now() });
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (files) {
      if (name === 'coverImg') {
        setFormData(prev => ({ ...prev, coverImg: files[0] }));
      } else if (name === 'galeryImg') {
        setFormData(prev => ({ ...prev, galeryImg: Array.from(files) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('nameProject', formData.nameProject);
      if (formData.coverImg) data.append('coverImg', formData.coverImg);
      formData.galeryImg.forEach(file => data.append('galeryImg', file));

      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/saveProject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        showToast(result.message || 'Projeto adicionado com sucesso!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.message || 'Erro ao adicionar projeto');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Erro ao adicionar projeto', 'error');
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatedPage>
      <PageTitle title="Administração - Janaina Possamai" />
      {isSubmitting && <LoadingOverlay message="Adicionando projeto" />}
      <Toast key={toast.key} message={toast.message} type={toast.type} />

      <div className={style.admContainer}>
        <h2 className={style.admTitle}>Adicionar Projetos</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label className={style.nameLabel}>Nome do projeto: </label>
            <input
              className="globalInput"
              type="text"
              name="nameProject"
              value={formData.nameProject}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={style.fileLabel}>
              Selecionar capa do projeto
              <input
                type="file"
                accept="image/*"
                required
                name="coverImg"
                onChange={handleChange}
                className={style.hiddenInput}
              />
            </label>
            {formData.coverImg && (
              <p className={style.selectedFile}>
                Capa selecionada: {formData.coverImg.name}
              </p>
            )}
          </div>

          <div>
            <label className={style.fileLabel}>
              Selecionar imagens da galeria
              <input
                type="file"
                accept="image/*"
                multiple
                required
                name="galeryImg"
                onChange={handleChange}
                className={style.hiddenInput}
              />
            </label>
            {formData.galeryImg.length > 0 && (
              <p className={style.selectedFile}>
                {formData.galeryImg.length} imagem(ns) selecionada(s)
              </p>
            )}
          </div>

          <button className="globalButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>

        <Link to="/adm">
          <img className={styleAdm.icon} src="/img/return.svg" alt="Voltar" title="Voltar" />
        </Link>
      </div>
    </AnimatedPage>
  );
}
