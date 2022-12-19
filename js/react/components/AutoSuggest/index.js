import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import './AutoSuggest.css'
// import theme from './theme.css'

// const options = [{
//   name:'suggestion0'
// },{
//   name:'suggestion1'
// },{
//   name:'suggestion2'
// },{
//   name:'suggestion3'
// },{
//   name:'suggestion4'
// }]


// const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>
// const getSuggestionValue = (suggestion) => suggestion.name


const AutoSuggest = ({
  inputProps,
  suggestions,
  onSuggestionSelected,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  renderSuggestion,
  getSuggestionValue
}) => {

  

  // const [value, setValue] = useState('')
  // const [ suggestions, setSuggestions ] = useState([])
  // // const [{ value, suggestions }, setState] = useState({ value:'', suggestions: [] })
  
  // const onSuggestionsFetchRequested = ({ value }) => {
  //   setSuggestions(options.filter(item => item.name.startsWith(value)))
  // }
  // const onSuggestionsClearRequested = () => {
  //   setSuggestions([])
  // }
  

  return(
    <div>
      <ReactAutosuggest 
        theme={{
          input: 'job-title-ip',
          suggestion: 'suggestion-item',
          suggestionsContainer: 'autosuggest-location-suggestions-container'

        }}
        suggestions={suggestions}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        inputProps={inputProps}
        shouldRenderSuggestions={(v) => typeof(v) === 'string' ? v.trim().length > 0 : v.name.trim().length > 0 }
      />
    </div>
  )
}

export default AutoSuggest