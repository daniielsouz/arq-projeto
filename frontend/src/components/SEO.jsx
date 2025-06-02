import { Helmet } from "react-helmet-async";

export default function SEO({  description }) {
  return (
    <Helmet>
      <meta name="description" content={description} />
    </Helmet>
  );
}
