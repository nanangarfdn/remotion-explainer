import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { EXPLAINER_DEMO_DURATION, ExplainerDemo } from "./explainer/ExplainerDemo";
import { SADAP_DURATION, Sadap } from "./sadap/Sadap";
import { KOTADESA_DURATION, KotaDesa } from "./shorts/KotaDesa";
import { HAPE_DURATION, Hape } from "./shorts/Hape";
import { HAPE2M_DURATION, Hape2m } from "./hape2m/Hape2m";
import { BOHONG_DURATION, Bohong } from "./shorts/Bohong";
import { CharacterLab } from "./lab/CharacterLab";
import { PULAU_DURATION, Pulau } from "./shorts/Pulau";
import { CONTOH_DURATION, Contoh, ContohVertical } from "./contoh/Contoh";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        id="ExplainerDemo"
        component={ExplainerDemo}
        durationInFrames={EXPLAINER_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Contoh"
        component={Contoh}
        durationInFrames={CONTOH_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ContohVertical"
        component={ContohVertical}
        durationInFrames={CONTOH_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Shorts">
        <Composition id="Pulau" component={Pulau} durationInFrames={PULAU_DURATION} fps={30} width={1080} height={1920} />
        <Composition id="KotaDesa" component={KotaDesa} durationInFrames={KOTADESA_DURATION} fps={30} width={1080} height={1920} />
        <Composition id="Hape" component={Hape} durationInFrames={HAPE_DURATION} fps={30} width={1080} height={1920} />
        <Composition id="Hape2m" component={Hape2m} durationInFrames={HAPE2M_DURATION} fps={30} width={1080} height={1920} />
        <Composition id="Bohong" component={Bohong} durationInFrames={BOHONG_DURATION} fps={30} width={1080} height={1920} />
      </Folder>
      <Composition id="CharacterLab" component={CharacterLab} durationInFrames={30} fps={30} width={1080} height={1920} />
      <Composition id="Sadap" component={Sadap} durationInFrames={SADAP_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
