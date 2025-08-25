import "./App.css";
import Navigation from "./components/Navigation";
import PhoneChecker from "./components/PhoneChecker";
import RecentReports from "./components/RecentReports";
import ReportForm from "./components/ReportForm";
import Stats from "./components/Stats";
import APISources from "./components/APISources";
import TrueCallerTest from "./components/TrueCallerTest";

function App() {
  return (
    <>
      <Navigation />
      <div id="home">
        <PhoneChecker />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div id="stats" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Statistiques en temps réel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez l'impact de notre communauté dans la lutte contre les arnaques téléphoniques
            </p>
          </div>
          <Stats />
        </div>

        <div id="apis" className="mb-16">
          <APISources />
        </div>

        <div id="truecaller-test" className="mb-16">
          <TrueCallerTest />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div id="check">
            <RecentReports />
          </div>
          <div id="report">
            <ReportForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
