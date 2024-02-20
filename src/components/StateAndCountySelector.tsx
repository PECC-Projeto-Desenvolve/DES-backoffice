import React from 'react';
import { Button } from '@material-tailwind/react';

/**
 * Component for selecting a state and county from a list.
 * Uses Brasil API to fetch states and counties data.
 * @returns {React.ReactElement} The StateAndCountySelector component.
 */
function StateAndCountySelector() {
  const [states, setStates] = React.useState([]);
  const [counties, setCounties] = React.useState([]);
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedCounty, setSelectedCounty] = React.useState('');
  const [loadingStates, setLoadingStates] = React.useState(true);
  const [loadingCounties, setLoadingCounties] = React.useState(false);

  /**
   * Fetches the list of states from the Brasil API on component mount.
   */
  React.useEffect(() => {
    fetch('https://brasilapi.com.br/api/ibge/uf/v1')
      .then((res) => res.json())
      .then(data => {
        setStates(data);
        setLoadingStates(false);
      });
  }, []);

  /**
   * Fetches the list of counties for the selected state.
   * Triggered when the selectedState changes.
   */
  React.useEffect(() => {
    if (selectedState) {
      setLoadingCounties(true);
      fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${selectedState}`)
        .then((res) => res.json())
        .then(data => {
          setCounties(data);
          setLoadingCounties(false);
        });
    }
  }, [selectedState]);

  /**
   * Handles state selection changes.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCounty('');
  };

  /**
   * Handles county selection changes.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
  };

  /**
   * Confirms the selection and updates the URL with the selected state and county.
   */
  const confirmSelection = () => {
    const url = new URL(window.location.href);

    const formattedCounty = selectedCounty
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c')
      .toLowerCase()
      .replace(/\s+\([^)]+\)/, '')
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-');


    url.searchParams.set('state', selectedState.toLowerCase());
    url.searchParams.set('county', formattedCounty);

    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className='flex w-full justify-between'>
      <span className='flex  gap-2 transition-all'>
        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={loadingStates}
          className="cursor-pointer rounded-md border-2 bg-[#eee/80] p-2 text-black">
          {loadingStates ? <option>Loading...</option> : <option value="">Selecione um estado</option>}
          {!loadingStates && states.map((state) => (
            <option key={state.id} value={state.sigla}>{state.nome}</option>
          ))}
        </select>
        {selectedState && <select
          value={selectedCounty}
          onChange={handleCountyChange}
          disabled={!selectedState || loadingCounties}
          className="cursor-pointer rounded-md border-2 bg-[#eee/80] p-2 text-black"
        >
          <option value="">Select a County</option>
          {!loadingCounties && counties.map((county) => (
            <option key={county.id} value={county.nome}>{county.nome}</option>
          ))}
        </select>}
      </span>
      <Button onClick={confirmSelection} disabled={!selectedCounty} color="green">Confirmar</Button>
    </div>
  );
}

export {StateAndCountySelector};
