import AppRouter from "./router";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/shared/Loader";

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loader text="Getting everything ready..." />;
  }

  return <AppRouter authUser={user} profile={profile} />;
}

export default App;