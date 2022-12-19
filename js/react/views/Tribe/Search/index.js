import Autosuggest from 'react-autosuggest'
import React, { useState } from 'react';
import { FormGroup } from 'reactstrap';

import DisplayPlaceholder from '../../../../../img/displayPlaceholder.svg'

const Search = ({ teamMembers, searchTextBox, setSearchTextBox, addMemberToTribe }) => {

    const [dropdownOpen, setOpen] = useState(false);
    const [userSuggestions, setUserSuggestions] = useState([])
    const [suggestions, setSuggestions] = useState([])


    const onUserSuggestionsClearRequested = () => setUserSuggestions([])
    
    const renderSuggestion = suggestion =>

    (
        <div className="tribe-autosuggest-renderedSuggestion">
            <div style={{width:'20%'}}>
            <img
                className="tribe-member-suggestion-display-picture"
                src={ DisplayPlaceholder}
                 />
            </div>
            <div style={{width:'80%'}}>
            <div className="tribe-autosuggest-name"> {suggestion.name} </div>
            <div className="tribe-autosuggest-email"> {suggestion.email} </div>
            </div>
        </div>
    )

    const getUserSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : teamMembers.filter(member =>
            member.name.toLowerCase().slice(0, inputLength) === inputValue)
    }
    const onUserSuggestionsFetchRequested = ({ value }) => setSuggestions(getUserSuggestions(value))

    const getSuggestionValue = suggestion => suggestion.name

    const inputProps = {
        placeholder: `Search by Name `,
        value: searchTextBox,
        onChange: (e, { newValue }) => {
                setSearchTextBox(newValue)
        }
    }
    const toggle = () => setOpen(!dropdownOpen);

    const showValue = (e, props) => {
        // getUserActivities(props.suggestionValue)
        const index = teamMembers.findIndex(member => member.name === props.suggestionValue);
        addMemberToTribe(teamMembers[index].userId)
        setSearchTextBox('')
    }
 
    return (
        <div >
            <FormGroup>
                <Autosuggest
                    theme={{
                        input: 'team-members-name',
                        suggestion: 'suggestion-item-team-members',
                        suggestionsContainer: 'autosuggest-suggestions-container-team-members'
                    }}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onUserSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onUserSuggestionsClearRequested}
                    onSuggestionSelected={showValue}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </FormGroup>
        </div>
    )
}
export default Search;