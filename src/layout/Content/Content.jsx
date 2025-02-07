import "./Content.css";
import ContentTop from '../../components/ContentTop/ContentTop';
import ContentMain from '../../components/ContentMain/ContentMain';

const Content = ({ children }) => {
  return (
    <div className='main-content'>
      <ContentTop />
      <ContentMain>
        {children}
      </ContentMain>
    </div>
  )
}

export default Content;
