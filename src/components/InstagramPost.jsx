import React, {useEffect} from 'react';

const scriptUrl = 'https://www.instagram.com/embed.js';
let scriptReady;

function loadInstagram() {
  if (!scriptReady) {
    scriptReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error('Instagram embed script could not load'));
      };
      document.head.appendChild(script);
    }).catch(() => {
      scriptReady = undefined;
    });
  }
  return scriptReady;
}

export default function InstagramPost({url}) {
  useEffect(() => {
    let mounted = true;
    loadInstagram().then(() => {
      if (mounted) window.instgrm?.Embeds?.process();
    });

    return () => {
      mounted = false;
    };
  }, [url]);

  return (
    <figure>
      <div key={url}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
        />
      </div>
      <figcaption><a href={url}>View this post on Instagram</a></figcaption>
    </figure>
  );
}
