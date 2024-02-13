import "./styles.css";
import styled from "styled-components";
import { CssBaseline } from "@mui/material";
import ForceGraph from "./ForceGraph";

const Main = styled("main")`
  display: flex;
  height: 100vh;
`;

export default function App() {
  return (
    <Main>
      <CssBaseline />
      {/*       <Sidebar>
        <ToolBox />
        <EditorBox
          defaultValue={JSON.stringify(miserables.nodes, null, 2)}
          title="Nodes"
        />
        <EditorBox
          defaultValue={JSON.stringify(miserables.links, null, 2)}
          title="Links"
        />
      </Sidebar> */}

      <ForceGraph />

      {/*       <GraphItem>
        <ForceGraph />
      </GraphItem> */}
    </Main>
  );
}