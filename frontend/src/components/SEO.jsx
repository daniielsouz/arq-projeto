import { Helmet } from "react-helmet";

export default function SEO({  description }) {
  return (
    <Helmet>
      <meta name="description" content={description} />
    </Helmet>
  );
}
