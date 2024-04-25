import styles from './App.module.css'
import Form from './components/Form/Form'
import WeatherDetail from './components/WeatherDetail/WeatherDetail';
import useWeather from './hooks/useWeather'
import Spinner from './components/Spinner/Spinner';
import Alert from './components/Alert/Alert';
function App() {
  
  const { weather, loading, notFound, fetchWeather, hasWeatherData } = useWeather();

  return (
    <>
      <h1 className={styles.title}>Buscador de clima</h1>

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather}/>
        {loading && <Spinner/>}
        {hasWeatherData && <WeatherDetail weather={weather}/>}
        {notFound && <Alert>Ciudad no encontrada</Alert>}
      </div>
    </>
  )
}

export default App;
