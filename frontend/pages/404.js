import Link from "next/link";
// import "../styles/errorpage/errorpage.css";
// import { NavLink } from "react-router-dom";
import Image from "next/image";
import Backhp from "../public/backhp.webp";
import Carr from "../public/carr.webp";

export default function FourOhFour() {
  return (
    <>
      <div className="bodyerror">
        <section class="notFound">
          <div class="img">
            <Image src={Backhp} alt="Back to the Homepage" />
            <Image src={Carr} alt=":)" />
          </div>
          <div class="text">
            <h1>404</h1>
            <h2>PAGE NOT FOUND</h2>
            <h3>BACK TO HOME?</h3>
            <Link href="/" class="yes">
              YES
            </Link>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.youtube.com/watch?v=xfr64zoBTAQ"
            >
              NO
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
