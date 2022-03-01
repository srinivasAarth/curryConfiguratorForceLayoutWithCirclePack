import React from 'react';
import { runForceGraph } from './ForceGraphGenerator';
import styles from './ForceGraph.module.css';

export function ForceGraph({ linksData, nodesData, tlinks, tnodes }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        tlinks,
        tnodes
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData, tlinks, tnodes]);

  return <div ref={containerRef} className={styles.container} />;
}
