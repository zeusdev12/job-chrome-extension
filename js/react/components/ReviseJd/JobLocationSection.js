import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'


import Section from '../Section'
import AutoSuggest from '../AutoSuggest'
import { setLocationValue, setLocationState, clearLocationSuggestions, fetchLocations } from '../../actions/jobDescription'
import { Button } from 'reactstrap'

const JobLocationSection = ({
  isLoadingSuggestions,
  suggestionsFetched,
  value,
  locationState,
  dispatch,
  viewMode
}) => {
  // console.log('JOB LOCATION PROPS: ', props)
  // const [LocationState, setLocationState] = useState([])

  useEffect(() => {
    if (value)
      dispatch(setLocationState([value]))
  }, [])

  const handleChangeInput = (e, { newValue }) => {
    !viewMode && dispatch(setLocationValue(newValue))
  }


  // console.log('VALUE IS: ', value)

  const inputProps = {
    value: typeof (value) === 'string' ? value : value.name,
    onChange: handleChangeInput,
    placeholder: 'e.g. San Francisco Bay Area',
    disabled: locationState.length > 4
  }

  const onSuggestionsFetchRequested = useCallback(_.debounce(({ value }) => {
    dispatch(fetchLocations(value))
  }, 200),
    []
  )

  const onsSuggestionsClearRequested = () => {
    dispatch(clearLocationSuggestions())
  }
  const onLocationSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (!locationState.includes(suggestionValue))
      dispatch(setLocationState([...locationState, suggestionValue]))

    dispatch(setLocationValue(''))
  }
  const handleDeleteLocation = (e) => {
    !viewMode && dispatch(setLocationState([...locationState].filter(lstate => typeof (lstate) === 'string' ?
      lstate != e.target.value :
      lstate.name != e.target.value)))
  }

  const renderSuggestion = (suggestion) => {
    return <div>{typeof (suggestion) === 'string' ? suggestion : suggestion.name}</div>
  }

  // console.log("===========================================", locationState)

  return (
    <Section title='Job Location'>
      <p>Where should the prospects be located at?</p>
      <div className="locationChipsContainer">
        {locationState && locationState.map((chip, i) => <Button
          key={i}
          value={typeof (chip) === 'string' ? chip : chip.name}
          className="locationChip"
          color="primary"
          outline
          onClick={handleDeleteLocation}
        >
          {`✓ ${typeof (chip) === 'string' ? chip : chip.name}`}
        </Button>)}
      </div>
      {
        !viewMode &&
        <AutoSuggest
          inputProps={inputProps}
          suggestions={suggestionsFetched}
          onSuggestionSelected={onLocationSuggestionSelected}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onsSuggestionsClearRequested}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={(suggestion) => suggestion}
        />}
    </Section>
  )
}

export default connect(state => ({
  ...state.jobDescription.jobLocation
}))(JobLocationSection)