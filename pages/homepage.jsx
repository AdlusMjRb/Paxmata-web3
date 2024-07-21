import React from "react";
import styles from "./Styles/homepage.module.css";

const homepage = () => {
  return (
    <div className={styles.landingpage}>
      <div className={styles.overlapgroupwrapper}>
        <div className={styles.overlapgroup}>
          <p className={styles.searchlocal}>
            <span className={styles.textwrapper}>
              Search local projects or build your own. <br />
              Remember to{" "}
            </span>
            <span className={styles.span}>login</span>
            <span className={styles.textwrapper}>
              {" "}
              to get the best from Paxmata
            </span>
          </p>
          <div className={styles.div}>CONNECT WITH CONFIDENCE,</div>
          <img
            className={styles.BACKINGSCREEN}
            alt="Backingscreen"
            src="https://c.animaapp.com/5qXXIK2M/img/backingscreen--1.png"
          />
          <div className={styles.searchfield}>
            <div className={styles.label}>Location...</div>
          </div>
          <button className={styles.searchbutton}>
            <div className={styles.textwrapper2}>SEARCH</div>
          </button>
          <div className={styles.textwrapper3}>BUILDING YOUR PROJECT</div>
          <div className={styles.ONYOURTERMS}> ON YOUR TERMS</div>
          <p className={styles.p}>
            <span className={styles.textwrapper}>
              Search local projects or build your own. <br />
              Remember to{" "}
            </span>
            <span className={styles.span}>login</span>
            <span className={styles.textwrapper}>
              {" "}
              and get the best from Paxmata
            </span>
          </p>
          <div className={styles.investtextbox} />
          <div className={styles.buildtestbox} />
          <img
            className={styles.sunsetslice}
            alt="Sunset slice"
            src="https://c.animaapp.com/5qXXIK2M/img/sunset-slice.png"
          />
          <div className={styles.investbutton}>
            <div className={styles.textwrapper4}>INVEST</div>
          </div>
          <div className={styles.buildbutton}>
            <div className={styles.textwrapper4}>BUILD</div>
          </div>
          <img
            className={styles.constructionslice}
            alt="Construction slice"
            src="https://c.animaapp.com/5qXXIK2M/img/construction-slice.png"
          />
          <div className={styles.extratextbox} />
          <div className={styles.reviewtextbox} />
          <button className={styles.button}>
            <div className={styles.textwrapper4}>REVIEW</div>
          </button>
          <img
            className={styles.arttechslice}
            alt="Arttech slice"
            src="https://c.animaapp.com/5qXXIK2M/img/arttech-slice.png"
          />
          <img
            className={styles.bottomslice}
            alt="Bottom slice"
            src="https://c.animaapp.com/5qXXIK2M/img/bottom-slice-1.png"
          />
        </div>
      </div>
    </div>
  );
};
export default homepage;
