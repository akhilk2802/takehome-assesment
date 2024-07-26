import "../styles/css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Supply Trace. All rights reserved.
      </p>
    </footer>
  );
};
export default Footer;
