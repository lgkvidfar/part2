import {React,useState,useEffect} from 'react';
import './App.css';
import axios from 'axios'

const Header = ({text}) => {
  return (
    <div>
    <h1>{text}</h1>
    <h2>due to too many api requests (monthly limit) it does not display as intended, but i unfortunetly do not want to pay for premium, so....</h2>
    </div>
  )
}

const Search = (props) => {
  return (
    <div>
      search: <input type="text" placeholder="filter" onChange={props.handleFilterChange} />
    </div>
  )
}


const Subheader = ({text,flag}) => {
  return (
    <h2>
      {text} ({flag})
    </h2>
  )
}

const Info = (props) => {
  const [fetchedTemp, setFetchedTemp] = useState([])
  const [fetchedWind, setFetchedWind] = useState([])
  const [image, setImage] = useState("")

  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY
    const getData = async() => {
      const data = await axios.get(
        `http://api.weatherstack.com/current?access_key=${apiKey}&query=${props.capital}`
        )
        setImage(data.data.current.weather_icons[0])
    }
    getData()
  }, [])

  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY
    const getData = async() => {
      const data = await axios.get(
        `http://api.weatherstack.com/current?access_key=${apiKey}&query=${props.capital}`
        )
        setFetchedWind(data.data.current.wind_speed)
    }
    getData()
  }, [])

  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY
    const getData = async() => {
      const data = await axios.get(
        `http://api.weatherstack.com/current?access_key=${apiKey}&query=${props.capital}`
        )
        setFetchedTemp(data.data.current.temperature)
        console.log(data.data)
    }
    getData()
  }, [])

  return (
    <div>
    <p> population: {props.population} </p>
    <p> capital: {props.capital} </p>
    <p> current temp: {fetchedTemp} celsius</p>
    <p>current wind speed: {fetchedWind} m/s</p>
    <img src={image}></img>
    </div>
  )
}

const Languages = ({languages}) => {
  const list = Object.values(languages)
  return (
    <div>
      <h3>languages</h3>
      <ul>
        {list.map(e=>
          <li key={e}>{e}</li>)}
      </ul>
    </div>
  )
}

const Render = (props) => {
  if(props.button === false) {
    return (
      <div>
        {props.filteredCountries
      .map(e => 
      <div key={e.name.common}> 
        <Subheader text={e.name.common} flag={e.flag} /> 
        <Button button={props.button} handleButton={props.handleButton}/>
        <Info capital={e.capital} population ={e.population}/>
        <Languages languages = {e.languages} />
        <img src={e.flags.png} alt={e.name.common}/>
      </div>
        )}
      </div>
    )
  } else {
    return (
      <div>
        {props.filteredCountries
      .map(e => 
      <div key={e.name.common}> 
        <Subheader text={e.name.common} flag={e.flag} /> 
        <Button button={props.button} handleButton={props.handleButton}/>
      </div>
        )}
      </div>
    )
  }
}

const Button = (props) => {
  return (
    <button onClick={props.handleButton}>show/hide</button>
  )
}

const Content = (props) => {
  if(props.filteredCountries.length < 10) {
  return (
    <div>
      <Render  filteredCountries={props.filteredCountries} button={props.button} handleButton={props.handleButton}/>
   </div>
  )
      } else {
        return (
          <div>
            too many
          </div>
        )
      }
}

function App() {
  const [ button, setButton ] = useState(true)
  const [ countries, setCountries ] = useState([])
  const [ filter,setFilter ] = useState("")
  const filteredCountries = countries.filter(e=> e.name.common.toLowerCase().includes(filter))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleButton = () => {
    setButton(!button)
  }

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  
  return (
    <div>
      <Header text="data for countries"/>
      <Search filter = {filter} handleFilterChange={handleFilterChange}/>
      <Content filteredCountries={filteredCountries} button={button} handleButton={handleButton}/>
    </div>
  );
}

export default App;
