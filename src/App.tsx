import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Directions from "./components/Directions";

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = {
//   lat: 0,
//   lng: 0,
// };

const App = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  return (
    <main className="text-lg text-red-400 h-screen w-screen">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
        <Directions />
      </APIProvider>
    </main>
  );
};
export default App;
