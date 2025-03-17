import { useState, useEffect } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'The Blog & Travel',
    imageSrcs: [
      require('@site/images/002.png').default,
      require('@site/images/001.png').default,
      require('@site/images/003.png').default,
      require('@site/images/004.png').default,
      require('@site/images/006.png').default,
      require('@site/images/005.png').default,
    ], // Array of images for rotation
    description: (
      <>
        Blog & Travel
        Life itself is a journey, and every moment—whether at home, in a distant land, or in the routine of 
        daily life—is an opportunity to experience and share God's goodness. This blog captures the beauty 
        of both the extraordinary and the ordinary, reflecting on faith, family, travel, and the lessons 
        found in everyday moments.
        
      </>
    ),
  },
  {
    title: 'Ministry',
    imageSrcs: [
      require('@site/images/028.png').default,
      require('@site/images/026.png').default,
      require('@site/images/022.png').default,
      require('@site/images/021.png').default,
      require('@site/images/018.png').default,
      require('@site/images/027.png').default,
      require('@site/images/024.png').default,
      require('@site/images/009.png').default,
    ], // Array of images for rotation
    description: (
      <>
        Ministry isn't confined to a pulpit—it's woven into everyday life. Whether in a remote village, 
        a grocery store line, serving in the community, or ministering to family and neighbors, we live 
        with the understanding that every moment is an opportunity to reflect Christ. Our mission is 
        simple: to be present, to serve, and to share His love wherever we are.
      </>
    ),
  },
  {
    title: 'Documentation',
    imageSrcs: [
      require('@site/images/014.png').default,
      require('@site/images/017.png').default,
      require('@site/images/016.png').default,
      require('@site/images/023.png').default,
      require('@site/images/019.png').default,
      require('@site/images/013.png').default,
    ], // Array of images for rotation
    description: (
      <>
        In the ever-changing environments of travel and ministry, reliable documentation is essential. 
        Designed for use in remote areas, this system allows me to host and update my site locally 
        using Markdown, npm, and GitHub action runners. Whether organizing mission insights, travel logs, 
        or technical workflows, this documentation ensures I stay prepared and connected no matter where 
        the journey takes me.
      </>
    ),
  },
];

function Feature({ Svg, imageSrcs, title, description }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageSrcs && imageSrcs.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSrcs.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [imageSrcs]);

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {imageSrcs ? (
          <img
            src={imageSrcs[currentIndex]} // Show current image
            alt={title}
            className={styles.featureImage}
          />
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}


export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
