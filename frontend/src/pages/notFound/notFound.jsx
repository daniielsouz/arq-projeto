import style from './notFound.module.css';
import AnimatedPage from '../../components/AnimatedPage';
import PageTitle from '../../components/PageTitle';

export default function NotFound() {
  return (
    <AnimatedPage>
    <PageTitle title="Página Não Encontrada - Janaina Possamai" />
    <div className={style.erro}>
      <div>
        <h1>Página Não Encontrada</h1>
        <span className={style.animacao}>!</span>
        <span className={style.animacao}>!</span>
        <span className={style.animacao}>!</span>
      </div>
      <p>Desculpe, mas a página que você está procurando não existe ou foi removida. Talvez ela ainda esteja em construção.</p>
    </div>
    </AnimatedPage>
  );
}
