import Image from "next/image";
import styles from "./Hero.module.css";

/** One Kiphar screen pulled apart into wireframe, components, and finished UI. */
function ProductLayers() {
  return (
    <div className={styles.figure}>
      <div className={styles.shadow} aria-hidden="true" />
      <div
        className={styles.product}
        role="img"
        aria-label="An exploded view of the Kiphar app: wireframe structure, reusable components, and the finished emergency screen, arranged in three layers."
      >
        <div
          className={`${styles.plane} ${styles.structure}`}
          aria-hidden="true"
        >
          <div className={styles.structureInner}>
            <div className={styles.wireHeader} />
            <div className={styles.wireParagraph} />
            <div className={styles.wireGrid}>
              {[0, 1, 2, 3].map((item) => (
                <div key={item}>
                  <i />
                  <span />
                  <span />
                </div>
              ))}
            </div>
            <div className={styles.wireButton} />
            <div className={styles.wireNav}>
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div
          className={`${styles.plane} ${styles.components}`}
          aria-hidden="true"
        >
          <div className={styles.componentsInner}>
            <div className={styles.componentType}>Aa</div>
            <div className={styles.swatches}>
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className={styles.componentGrid}>
              <div>
                <span>+</span>
                <i />
                <i />
              </div>
              <div>
                <span>↗</span>
                <i />
                <i />
              </div>
            </div>
            <div className={styles.componentButton} />
            <div className={styles.componentLines}>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div
          className={`${styles.plane} ${styles.interface}`}
          aria-hidden="true"
        >
          <div className={styles.screen}>
            {/* CSS frames the original image shared with the case study. */}
            <Image
              src="/images/kiphar-emergency.webp"
              alt=""
              width={400}
              height={620}
              sizes="400px"
              loading="eager"
              fetchPriority="high"
              className={styles.screenImage}
            />
          </div>
          <div className={styles.glassEdge} />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" id="hero">
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />
      <div className={styles.body}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.identityMark} aria-hidden="true" />
            Dike Uche / Designer &amp; builder
          </p>
          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.design}>
              Design<span className={styles.punctuation}>,</span>
            </span>
            <span className={styles.engineered}>
              engineered<span className={styles.punctuation}>.</span>
            </span>
          </h1>
          <p className={styles.description}>
            UX Manager at Western Union. Eight years designing fintech,
            sportsbook and travel products, and I build what I design.
          </p>
          <a href="#work" className={styles.workLink}>
            Explore the work <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ProductLayers />
      </div>
    </section>
  );
}
