/* eslint-disable no-undef */
import "./App.css";
import * as d3 from "d3";
import React from "react";
import { ForceGraph } from "./components/ForceGraph.js";
import SubstituteOptions from "./components/SubstituteOptions";

function App() {
  const [substitutes, setSubstituteState] = React.useState([]);
  const graphData = {
    nodes: [
      {
        name: "hariMohan",
        id: 1,
      },
      {
        name: "mithilesh",
        id: 2,
        substituteData: [
          {
            name: "Darci",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Darci",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Darci",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Darci",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
        ],
      },

      {
        name: "avdesh",
        id: 3,
        substituteData: [
          {
            name: "Hello",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Hello",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Hello",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "Hello",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
        ],
      },
      {
        name: "akhilesh",
        id: 4,
        substituteData: [
          {
            name: "shanu",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "shanu",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "shanu",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "shanu",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
        ],
      },
      {
        name: "sarvesh",
        id: 5,
        substituteData: [
          {
            name: "chary",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "chary",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "chary",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "chary",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
        ],
      },
      {
        name: "bhavesh",
        id: 6,
        substituteData: [
          {
            name: "madhuri",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "madhuri",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "madhuri",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
          {
            name: "madhuri",
            property: "bhanu",
            quantity: "10grm",
            nutrition: "15cl",
          },
        ],
      },
      {
        name: "shanu",
        id: 7,
      },
      {
        name: "Richa",
        id: 8,
      },
      {
        name: "bhanu",
        id: 9,
      },
      {
        name: "Aditya",
        id: 10,
      },
      {
        name: "shilpi",
        id: 11,
      },
      {
        name: "rashmi",
        id: 12,
      },
      {
        name: "piyush",
        id: 13,
      },
      {
        name: "Bhavya",
        id: 14,
      },
      {
        name: "Divya",
        id: 15,
      },
      {
        name: "rey",
        id: 16,
      },
      {
        name: "aarya",
        id: 17,
      },
      {
        name: "virat",
        id: 18,
      },
    ],
    links: [
      {
        source: 1,
        target: 2,
      },
      {
        source: 1,
        target: 3,
      },
      {
        source: 1,
        target: 4,
      },
      {
        source: 1,
        target: 5,
      },
      {
        source: 1,
        target: 6,
      },
      {
        source: 2,
        target: 7,
      },
      {
        source: 2,
        target: 8,
      },
      {
        source: 3,
        target: 9,
      },
      {
        source: 3,
        target: 10,
      },
      {
        source: 3,
        target: 11,
      },
      {
        source: 4,
        target: 12,
      },
      {
        source: 4,
        target: 13,
      },
      {
        source: 5,
        target: 14,
      },
      {
        source: 5,
        target: 15,
      },
      {
        source: 5,
        target: 16,
      },
      {
        source: 6,
        target: 17,
      },
      {
        source: 6,
        target: 18,
      },
    ],
  };

  const initialLink = graphData.links.filter((e) => e.source === 1);

  const initialNodes = graphData.nodes.filter((el) => {
    for (let i = 0; i < initialLink.length; i++) {
      if (el.id === initialLink[i].target) {
        return el;
      } else if (el.id === initialLink[i].source) {
        return el;
      }
    }
  });
  console.log(substitutes);
  const lengthing = initialLink.length;

  return (
    <div rclassName="App">
      <section className="Main">
        <ForceGraph
          linksData={initialLink}
          nodesData={initialNodes}
          lengthing={lengthing}
          tlinks={graphData.links}
          tnodes={graphData.nodes}
          setSubstituteState={setSubstituteState}
        />
      </section>
      <div>
        {substitutes.length !== 0 && (
          <SubstituteOptions substitutes={substitutes} />
        )}
      </div>
    </div>
  );
}

export default App;
