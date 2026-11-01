import { Link } from 'react-router-dom'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-5">
            <Link className="footer-brand d-inline-flex align-items-center gap-2 mb-3" to="/">
              <span className="brand-mark">
                <i className="bi bi-pc-display-horizontal" aria-hidden="true" />
              </span>
              <span className="fs-4 fw-bold text-white">
                Hard<span className="text-brand">Store</span>
              </span>
            </Link>
            <p className="text-white-50 mb-3 footer-description">
              Tecnología de alto rendimiento para gamers, profesionales y entusiastas del hardware.
              Componentes, periféricos y accesorios seleccionados por especialistas.
            </p>
            <div className="d-flex gap-2">
              <a className="footer-social" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
              <a className="footer-social" href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
                <i className="bi bi-twitter-x" aria-hidden="true" />
              </a>
              <a className="footer-social" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube" aria-hidden="true" />
              </a>
              <a className="footer-social" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="bi bi-github" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-heading">Tienda</h2>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Catálogo</Link></li>
              <li><Link to="/login">Mi cuenta</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-heading">Categorías</h2>
            <ul className="footer-links">
              <li><Link to="/productos">Computación</Link></li>
              <li><Link to="/productos">Componentes</Link></li>
              <li><Link to="/productos">Periféricos</Link></li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h2 className="footer-heading">Contacto</h2>
            <ul className="footer-links footer-contact">
              <li><i className="bi bi-geo-alt" aria-hidden="true" /> Av. Tecnología 2026, CABA</li>
              <li><i className="bi bi-envelope" aria-hidden="true" /> ventas@hardstore.com</li>
              <li><i className="bi bi-telephone" aria-hidden="true" /> +54 11 5555-2026</li>
              <li><i className="bi bi-clock" aria-hidden="true" /> Lun a Sáb · 9 a 19 hs</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small text-white-50">
          <span>© {CURRENT_YEAR} HardStore. Todos los derechos reservados.</span>
          <span>TP Final · React + Vite + JSON Server</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
