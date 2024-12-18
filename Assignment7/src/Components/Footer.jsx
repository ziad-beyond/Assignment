const Footer = () => {
  return (
    <footer className="footer bg-base  p-10 text-white">
      <aside>
        <img
          className="w-40 h-16 "
          src="https://www2.0zz0.com/2024/12/17/13/639597883.png"
          alt=""
        />

        <p>
          Z-Movies.
          <br />
          Copyright © 2024 - All right reserved
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Movies</a>
        <a className="link link-hover">TV</a>
        <a className="link link-hover">Shows</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
};

export default Footer;
