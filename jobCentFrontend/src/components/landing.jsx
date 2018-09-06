import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "../scss/components/landing.css";
import "../scss/components/bubbles.css";
import ncentLogo from "../img/logo_white.png";
import { Bubbles } from "./bubbles";
import diagnalPhone from "../img/diagnal_phone.png";
import standupPhone from "../img/standup_phone.png";
import phone from "../img/phone.png";

class Landing extends React.Component {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    let windowHeight = window.innerHeight;
    let scrollPosition = window.scrollY;
    let scrollPercentage = scrollPosition / windowHeight;
    // if (window.pageYOffset > 0) {
    // let divOffsetTop = document.getElementById("clear").offsetTop;

    let opacity = 1 - scrollPercentage;
    document.getElementById("opaque").style.opacity = opacity;
    // console.log("page y offset: " + window.pageYOffset + " divOffsetTop: " + divOffsetTop + " opacity: " + opac);
    //   console.log(opacity);
    // }
  }
  render() {
    return (
      <div className="landing">
        <section id="opaque" className="background height">
          <Bubbles />
          <header className="jc-header-bar">
            <div className="ncent-logo">
              <div className="test-button small">
                <img src={ncentLogo} alt="ncent logo" />
              </div>
              <div className="logo-title">jobCent</div>
            </div>
            <div>
              <Link
                smooth
                to="#about"
                className="button button-round button-about"
              >
                About
              </Link>
              <Link to="/login" className="button button-round">
                Sign In
              </Link>
            </div>
          </header>
          <div className="nav-arrow">
            <Link smooth to="#about" className="arrow" />
          </div>
        </section>
        <section id="clear" className="scrolling height">
          <div className="about-jobcent">
            <div id="about">
              <header className="about-header-bar">
                <div className="ncent-logo">
                  {/* <svg className="app-icon" viewBox="0 0 64 64">
                  <g
                    fill-rule="nonzero"
                    fill="#FFF"
                    width="477.000000pt"
                    height="25.000000pt"
                    viewBox="0 0 477.000000 477.000000"
                  >
                    <path
                      d="M41.7 0c6.4 0 9.6 0 13.1 1.1a13.6 13.6 0 0 1 8.1 8.1C64 12.7 64 15.9 64 22.31v19.37c0 6.42 0 9.64-1.1 13.1a13.6 13.6 0 0 1-8.1 8.1C51.3 64 48.1 64 41.7 64H22.3c-6.42 0-9.64 0-13.1-1.1a13.6 13.6 0 0 1-8.1-8.1C0 51.3 0 48.1 0 41.69V22.3c0-6.42 0-9.64 1.1-13.1a13.6 13.6 0 0 1 8.1-8.1C12.7 0 15.9 0 22.3 0h19.4z"
                      fill="#00D632"
                    />
                  </g>
                </svg> */}
                  <div className="test-button small">
                    <img src={ncentLogo} alt="ncent logo" />
                  </div>
                  <div className="logo-title">jobCent</div>
                </div>
                <div className="header-sign-in">
                  {/* <Link to="/test" className="test-button">
                    Loreum
                  </Link> */}
                  <div className="test-button">Sign In</div>
                </div>
              </header>

              <div className="about-content">
                <div className="app-image">
                  {/* <br />
                <br />
                jobCent Image Here
                <br />
                <br /> */}
                  <picture>
                    <source srcSet={diagnalPhone} media="(min-width: 1278px)" />
                    <source srcSet={standupPhone} media="(min-width: 1024px)" />
                    <img src={phone} />
                  </picture>
                </div>
                <div className="app-info">
                  <p>
                    jobCent is the nCent Labs incentive protocol that
                    incentivizes people to find a potential candidate to join
                    the nCent Labs workspace.
                  </p>
                  <p>
                    jobCent encourages people to refer the most qualified
                    candidates by rewarding everyone involved in referral upon
                    the hire of a candidate.
                  </p>
                  <p>
                    It's a win-win situation: better candidates, faster hires,
                    and bonuses for those who take part in finding our ideal
                    employee.
                  </p>
                  {/* <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer pellentesque, justo ac rutrum suscipit, ipsum arcu
                    feugiat magna, eu auctor tortor felis ut nulla.
                  </p>
                  <p>
                    Sed at nisl ut turpis tristique mollis nec at justo. Ut eget
                    lobortis turpis, non fringilla justo. Phasellus ultricies
                    sed elit quis vulputate.
                  </p>
                  <p>
                    Mauris efficitur nibh et sem tempus facilisis. Donec tortor
                    orci, auctor id commodo sed, rutrum ut nibh. Vivamus urna
                    elit, egestas id dui eu, bibendum iaculis felis.
                  </p> */}
                  <div>
                    <div className="content-sign-in">
                      {/* <Link to="/test">Loreum</Link> */}
                      <a href="https://angel.co/ncent/jobs/368555-full-stack-developer">
                        AngelList
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="social-media">
                <a
                  className="fab fa-twitter fa-lg"
                  target="_blank"
                  href="https://twitter.com/kk_ncnt"
                />
                <a
                  className="fab fa-medium fa-lg"
                  target="_blank"
                  href="https://medium.com/@kk_ncnt"
                />
                <a
                  className="fab fa-youtube fa-lg"
                  target="_blank"
                  href="https://www.youtube.com/watch?v=Op6t4u9rwMA&t=841s"
                />
              </div>
              <div className="links" />
            </footer>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
