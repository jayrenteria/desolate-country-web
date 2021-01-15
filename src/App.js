import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Filter from './Components/Filter';
import RangeFilter from './Components/RangeFilter';
import Map from './Components/Map/Map';
import { getData } from './utils/getData'

function App() {

  const [fullData, setFullData] = useState([]);
  const [shownData, setShownData] = useState([]);
  const [sortValues, setSortValues] = useState({});
  const [names, setNames] = useState([]);
  const [names_of_institutions, setNamesOfInstitutions] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const data = getData();
    setFullData(data);
    setShownData(data);
    setNames(getItems('name', data));
    setNamesOfInstitutions(getItems('name_of_institution', data));
    setYears(getItems('year', data));
  }, []);

  useEffect(() => {
    const newValues = fullData.filter(data => {
      let nameMatches = checkForMatch(sortValues, 'name', data);
      let institutionMatches = checkForMatch(sortValues, 'name_of_institution', data);
      let yearMatches = checkForYears(sortValues, data);
      return nameMatches && institutionMatches && yearMatches;
    })
    setShownData(newValues);
  }, [sortValues, fullData]);

  const checkForMatch = (sortValues, key, data) => {
    if ( sortValues[key]?.length ) {
      return sortValues[key].indexOf(data[key]) > -1;
    }
    return true;
  }

  const checkForYears = (sortValues, data) => {
    if ( sortValues['year']?.length ) {
      const [min, max] = sortValues['year'];
      const [data_min, data_max] = data['year'].split('-');
        return min <= parseInt(data_min) && max >= parseInt(data_max);
    }
    return true;
  }

  const updateSort = (key, values) => {
    setSortValues({...sortValues, [key]: values});
  }

  const getItems = (type, data) => {
    let items = []
    Object.keys(data).map((key, index) => {
      if (!items.includes(data[key][type])) {
        items.push(data[key][type]) 
      }
    })
    return items
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Filter label={'Name'} setSelected={result => updateSort('name', result)} items={names} selected={sortValues['name']}/>
        <Filter label={'Institution'} setSelected={result => updateSort('name_of_institution', result)} items={names_of_institutions} selected={sortValues['name_of_institution']}/>
        <RangeFilter label={'Year Range'} setSelected={result => updateSort('year', result)} items={years}/>
        <Map 
          dataToShow={shownData}
        />
      </header>
    </div>
  );
}

export default App;
