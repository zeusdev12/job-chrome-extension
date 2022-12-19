import React, {useState, useRef, useCallback, useEffect} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Label,
    Input,
    FormGroup,
    Modal,
    ModalBody,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form
} from 'reactstrap'


import Toggle from 'react-toggle'
import "react-toggle/style.css"


import {callLinkedinApi} from '../../utils'

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'

import BackButtonIcon from '../../../../img/BackButton.svg'

import EliminateInactiveIcon from '../../../../img/stop-small-inactive.svg'
import EliminateActiveIcon from '../../../../img/stop-small.svg'
import HighlightActiveIcon from '../../../../img/check-small.svg'
import HighlightInactiveIcon from '../../../../img/check-small-inactive.svg'
import DropDownIcon from '../../../../img/dropdown.svg'

import ScoringFilterSection from "./ScoringFilterSection";

import './style.css'

import qs from 'query-string'
import {Switch, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    clearScoringFilter,
    unselectAllProspects,
    setSkillsFilters,
    toggleStrictSkills,
    setStrictSkills,
    setSchoolFilters,
    setEducationFilters,
    toggleStrictEducation,
    setCurrentTitleFilters,
    toggleStrictCurrentTitle,
    setPastTitleFilters,
    toggleStrictPastTitle,
    setCurrentCompanyFilters,
    setPastCompanyFilters,
    setCompanySizeFilter,
    toggleCompanySizeFilter,
    setCurrentIndustryFilters,
    setPastIndustryFilters,
    setLocationFilters,
    setVisaFilters,
    setTotalExperienceFilter,
    setRelevantExperienceFilter,
    toggleTotalExperienceFilter,
    toggleRelevantExperienceFilter,
    clearAdvancedFilters

} from '../../actions/score'

import Autosuggest from 'react-autosuggest'

import {manualApiCall} from '../../utils'

import { setLocationValue, setLocationState, clearLocationSuggestions, fetchLocations } from '../../actions/jobDescription'


const visaArray = [
  {
      id: 0,
      name: 'H1b'
  }, {
      id: 1,
      name: 'Green Card'
  }, {
      id: 2,
      name: 'Citizen'
  }, {
      id: 3,
      name: 'OPT'
  }
]

const compnaySizeRangeArray = [
    {
      id: 0,
      value: {
        min: 1,
        max: 10
      }
    }, {
      id: 1,
      value: {
        min: 11,
        max: 50
      }
    }, {
      id: 2,
      value: {
        min: 51,
        max: 200
      }
    }, {
      id: 3,
      value: {
        min: 201,
        max: 500
      }
    }, {
      id: 4,
      value: {
        min: 501,
        max: 1000
      }
    }, {
      id: 5,
      value: {
        min: 1001,
        max: 5000
      }
    }, {
      id: 6,
      value: {
        min: 5001,
        max: 10000
    }
    }, {
      id: 7,
      value: {
        min: 10001,
        max: 999999999
    }
}
]

const getSuggestionValue = suggestion => suggestion
const renderSuggestion = suggestion => (
    <div className="renderedSuggestionContainer"> {suggestion} </div>
)

const AdvancedFilterPillButton = (props) => {
  const {
    keyId,
    activeState=0, 
    filterName="",
    handleAdvancedFilterPillHighlight, 
    handleAdvancedFilterPillEliminate
  
  } = props

    return (
        <div key={keyId} className={`${
          activeState===2?
            "AdvancedFilterPillContainerEliminate ": 
          ""}AdvancedFilterPillButtonContainer`}>
            <Button 
              className={`${
                activeState===1 ?
                  "AdvancedFilterPillHighlight ": 
                activeState===2 ?
                  "AdvancedFilterPillEliminate ": 
                ""}AdvancedFilterPillButtonText`} 
              outline 
              color="primary"
              onClick={(e) => handleAdvancedFilterPillHighlight(activeState, filterName)}>
              {filterName}
            </Button>
            <Button className={`${
                activeState===1 ?
                  "AdvancedFilterEliminateInactive ": 
                activeState===2 ?
                  "AdvancedFilterEliminateActive ": 
                ""}AdvancedFilterPillButtonEliminate`} 
                outline 
                color="danger"
                onClick={(e) => handleAdvancedFilterPillEliminate(activeState, filterName)}>
              <img
                src={activeState===2? EliminateActiveIcon :EliminateInactiveIcon}/>
            </Button>
            <Button className={`${
                activeState===1 ?
                  "AdvancedFilterPillHighlight ": 
                activeState===2 ?
                  "AdvancedFilterPillEliminate ": 
                ""}AdvancedFilterPillButtonHighlight`} 
              outline 
              color="primary"
              onClick={(e) => handleAdvancedFilterPillHighlight(activeState, filterName)}>
              <img src={activeState===1? HighlightActiveIcon :HighlightInactiveIcon}/>
            </Button>
        </ div>
    )
}


const AdvanceFilterSection = (props) => {

    const [schoolsTextBox, setSchoolsTextBox] = useState('')
    const [companyTextBox, setCompanyTextBox] = useState('')

    const [schoolsSuggestions, setSchoolsSuggestions] = useState([])
    const [companySuggestions, setCompanySuggestions] = useState([])


    const [skillsTextBox, setSkillsTextBox] = useState('')
    const [industryTextBox, setIndustryTextBox] = useState('')
    const [titleCurrentTextBox, setCurrentTitleTextBox] = useState('')
    const [titlePastTextBox, setPastTitleTextBox] = useState('')
    const [companyCurrentTextBox, setCurrentCompanyTextBox] = useState('')
    const [companyPastTextBox, setPastCompanyTextBox] = useState('')
    const [industryCurrentTextBox, setCurrentIndustryTextBox] = useState('')
    const [industryPastTextBox, setPastIndustryTextBox] = useState('')
    const [LocationTextBox, setLocationTextBox] = useState('')
    const [EducationTextBox, setEducationTextBox] = useState('')

    const [skillsSuggestions, setSkillsSuggestions] = useState([])
    const [industrySuggestions, setIndustrySuggestions] = useState([])
    const [CurrentTitleSuggestions, setCurrentTitleSuggestions] = useState([])
    const [PastTitleSuggestions, setPastTitleSuggestions] = useState([])
    const [CurrentCompanySuggestions, setCurrentCompanySuggestions] = useState([])
    const [PastCompanySuggestions, setPastCompanySuggestions] = useState([])
    const [CurrentIndustrySuggestions, setCurrentIndustrySuggestions] = useState([])
    const [PastIndustrySuggestions, setPastIndustrySuggestions] = useState([])
    const [EducationSuggestions, setEducationSuggestions] = useState([])
    const [LocationSuggestions, setLocationSuggestions] = useState([])

    const [cSRDropDown, setcSRDropDown] = useState(false)

    const highRef = useRef(null)
    const elimRef = useRef(null)

    const sSOrRef = useRef(null)
    const sSAndRef = useRef(null)

    const {
        Show,
        setShow,
        push,
        search,
        dispatch,
        setSelectAllProspectsFlag,

        FilterCount,
        setFilterCount,

        setSchoolsFilterList,
        schoolsFilterList,
        setVisaStatus,
        VisaStatus,
        setCompanyFilterList,
        companyFilterList,
        setSkillsFilterList,
        skillsFilterList,
        setIndustryFilterList,
        industryFilterList,
        setTitleFilterList,
        titleFilterList,
        setVisa,
        Visa,
        locations,
        skills,
        industries,
        educations,
        companies,
        schools,
        titles,
        AdvFilters,
        suggestionsFetched,
        activeTab,

        ScoringFilters,

        titleFlag,
        skillFlag,
        industryFlag,
        experienceFlag,
        educationFlag

    } = props

    const advFilterList = ["sS","eS","eSS","eCT","ePT","eCC","ePC","eCI","ePI","eL","eV","hS","hSS","eE","hE","hCT","hPT","hCC","hPC","hCI","hPI","hL","hV","tE","rE","eCSR","hCSR","cTS","pTS", "eDS"]
    const scrFilterList = ["tSF","sSF","expSF","edxSF","iSF"]
    

    useEffect(() => {

        // const jobId = qs.parse(search).jId

        // chrome.storage.local.get('jobArray', (result) => {
        //     const locationData = result.jobArray.filter(jobs => jobs.jobID == jobId)[0].jobArray.filter(jd => jd.tag === "JOB_LOCATION")[0].data
        //     dispatch(setLocationFilters(locationData.map(itm => ({name: itm, value: 0}))))
        // })

        dispatch(setLocationFilters(locations.slice(0, 4).map(itm => ({name: itm, value: 0}))))
        dispatch(setSkillsFilters(skills.slice(0, 4).map(itm => ({name: itm, value: 0}))))
        dispatch(setSchoolFilters(schools.map(itm => ({name: itm, value: 0}))))
        dispatch(setEducationFilters(educations.slice(0, 4).map(itm => ({name: itm, value: 0}))))
        dispatch(setCurrentTitleFilters(titles.slice(0, 4).map(itm => ({name: itm, value: 0}))))
        dispatch(setPastTitleFilters(titles.slice(0, 4).map(itm => ({name: itm, value: 0}))))
        dispatch(setCurrentCompanyFilters(companies.map(itm => ({name: itm, value: 0}))))
        dispatch(setPastCompanyFilters(companies.map(itm => ({name: itm, value: 0}))))
        dispatch(setCurrentIndustryFilters(industries.map(itm => ({name: itm, value: 0}))))
        dispatch(setPastIndustryFilters(industries.map(itm => ({name: itm, value: 0}))))

        // setSkillsFilterList(skills.slice(0, 4).map(itm => ({name: itm, value: false})))
        // setTitleFilterList(titles.slice(0, 4).map(itm => ({name: itm, value: false})))
        // setSchoolsFilterList(schools.map(itm => ({name: itm, value: false})))
        // setCompanyFilterList(companies.map(itm => ({name: itm, value: false})))
        // setIndustryFilterList(industries.map(itm => ({name: itm, value: false})))
    }, [])


    // const getIndustrySuggestions = value => {
    // const inputValue = value.trim().toLowerCase();
    // const inputLength = inputValue.length;

    // return inputLength === 0 ? [] : industry.filter(industryName =>
    //     industryName.toLowerCase().slice(0, inputLength) === inputValue
    // )
    // }


    const getTitleSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : [value,...titles.filter(ttlName => ttlName.trim().toLowerCase().startsWith(inputValue) && ttlName.trim().toLowerCase()!==inputValue)]
    }
    const getSkillsSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : skills.filter(skl => skl.trim().toLowerCase().startsWith(inputValue))
    }

    const getLocationSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0 ? [] : locations.filter(itm => itm.trim().toLowerCase().startsWith(inputValue))
    }

    const getEducationSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0 ? [] : [value,...educations.filter(itm => itm.trim().toLowerCase().startsWith(inputValue) && itm.trim().toLowerCase()!==inputValue)]
    }

    // const getSchoolsSuggestions = value => {
    // const inputValue = value.trim().toLowerCase();
    // const inputLength = inputValue.length;

    // return inputLength === 0 ? [] : school_names.filter(schlName =>
    //     schlName.toLowerCase().slice(0, inputLength) === inputValue
    // )
    // }

    // const getCompanySuggestions = value => {
    // const inputValue = value.trim().toLowerCase();
    // const inputLength = inputValue.length;

    // return inputLength === 0 ? [] : company_names.filter(cmpnyName =>
    //     cmpnyName.toLowerCase().slice(0, inputLength) === inputValue
    // )
    // }


    const onSkillsSuggestionsFetchRequested = ({value}) => setSkillsSuggestions(getSkillsSuggestions(value))
    const onSkillsSuggestionsClearRequested = () => setSkillsSuggestions([])

    const onSkillsSuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {

      setFilterCount(FilterCount + 1)
      dispatch(setSkillsFilters([{
        name: suggestionValue,
        value: 1}, 
        ...AdvFilters.skills.filter(itm => itm.name !== suggestionValue )]))
        
        setSkillsTextBox('')
    }
    const inputSkillsProps = {
        placeholder: `Search for a ${'Skill'}`,
        value: skillsTextBox,
        onChange: (e, {newValue}) => setSkillsTextBox(newValue)
    }



    const onLocationSuggestionsFetchRequested = ({value}) => setLocationSuggestions(getLocationSuggestions(value))
    const onLocationSuggestionsClearRequested = () => setLocationSuggestions([])

    const onLocationSuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {

      setFilterCount(FilterCount + 1)
      dispatch(setLocationFilters([{
      name: suggestionValue,
      value: 1}, 
      ...AdvFilters.location.filter(itm => itm.name !== suggestionValue )]))
      setLocationTextBox('')
    }

    const inputLocationProps = {
        placeholder: `Search for a ${'Location'}`,
        value: LocationTextBox,
        onChange: (e, {newValue}) => setLocationTextBox(newValue)
    }


    const onEducationSuggestionsFetchRequested = ({value}) => setEducationSuggestions(getEducationSuggestions(value))
    const onEducationSuggestionsClearRequested = () => setEducationSuggestions([])

    const onEducationSuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {

      setFilterCount(FilterCount + 1)
      dispatch(setEducationFilters([{
      name: suggestionValue,
      value: 1}, 
      ...AdvFilters.education.filter(itm => itm.name !== suggestionValue )]))
      setEducationTextBox('')
    }

    const inputEducationProps = {
        placeholder: `Search for a ${'Education Degree'}`,
        value: EducationTextBox,
        onChange: (e, {newValue}) => setEducationTextBox(newValue)
    }

    


    // const onSchoolsSuggestionsFetchRequested = ({ value }) => setSchoolsSuggestions(getSchoolsSuggestions(value))

    // https://www.linkedin.com/voyager/api/typeahead/hitsV2?keywords=stan&origin=OTHER&q=type&type=SCHOOL
    const onSchoolsSuggestionsFetchRequested = useCallback(_.debounce(async ({value}) => {
        try {
            const response = await callLinkedinApi(`/voyager/api/typeahead/hitsV2?keywords=${
                encodeURIComponent(value)
            }&origin=OTHER&q=type&type=SCHOOL`, {
                method: 'GET',
                headers: {
                    'x-li-lang': 'en_US',
                    'x-restli-protocol-version': '2.0.0'
                }
            })

            const schoolSuggestions = response.elements.map(item => item.text.text)
            // setIndustrySuggestions(industrySuggestions)
            setSchoolsSuggestions(schoolSuggestions)


        } catch (e) {
            throw e
        }

    }, 200), [])


    const onSchoolsSuggestionsClearRequested = () => setSchoolsSuggestions([])

    const onSchoolsSuggestionSelected = (event, {
      suggestion,
      suggestionValue,
      suggestionIndex,
      sectionIndex,
      method}) => {
        setFilterCount(FilterCount + 1)
        dispatch(setSchoolFilters([{
          name: suggestionValue,
          value: 1}, 
          ...AdvFilters.school.filter(itm => itm.name !== suggestionValue )]))
        
          setSchoolsTextBox('')
    }
    const inputSchoolsProps = {
        placeholder: `Search for a ${'school'}`,
        value: schoolsTextBox,
        onChange: (e, {newValue}) => setSchoolsTextBox(newValue)
    }

    const onCurrentCompanySuggestionsFetchRequested = useCallback(_.debounce(async ({value}) => {
        try {
            const response = await callLinkedinApi(`/voyager/api/typeahead/hitsV2?keywords=${
                encodeURIComponent(value)
            }&origin=OTHER&q=type&type=COMPANY`, {
                method: 'GET',
                headers: {
                    'x-li-lang': 'en_US',
                    'x-restli-protocol-version': '2.0.0'
                }
            })

            const companySuggestions = response.elements.map(item => item.text.text)
            // setIndustrySuggestions(industrySuggestions)
            setCurrentCompanySuggestions(companySuggestions)


        } catch (e) {
            throw e
        }

    }, 200), [])



    const onPastCompanySuggestionsFetchRequested = useCallback(_.debounce(async ({value}) => {
      try {
          const response = await callLinkedinApi(`/voyager/api/typeahead/hitsV2?keywords=${
              encodeURIComponent(value)
          }&origin=OTHER&q=type&type=COMPANY`, {
              method: 'GET',
              headers: {
                  'x-li-lang': 'en_US',
                  'x-restli-protocol-version': '2.0.0'
              }
          })
          

          const companySuggestions = response.elements.map(item => item.text.text)
          // setIndustrySuggestions(industrySuggestions)
          setPastCompanySuggestions(companySuggestions)


      } catch (e) {
          throw e
      }

  }, 200), [])


    const onCurrentCompanySuggestionsClearRequested = () => setCurrentCompanySuggestions([])

    const onCurrentCompanySuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {
      setFilterCount(FilterCount + 1)
      dispatch(setCurrentCompanyFilters([{
      name: suggestionValue,
      value: 1}, 
      ...AdvFilters.currentCompany.filter(itm => itm.name !== suggestionValue )]))
        setCurrentCompanyTextBox('')
    }


    const onPastCompanySuggestionsClearRequested = () => setPastCompanySuggestions([])

    const onPastCompanySuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {
      setFilterCount(FilterCount + 1)
      dispatch(setPastCompanyFilters([{
      name: suggestionValue,
      value: 1}, 
      ...AdvFilters.pastCompany.filter(itm => itm.name !== suggestionValue )]))
        setPastCompanyTextBox('')
    }

    const inputCurrentCompanyProps = {
        placeholder: `Search for a ${'company'}`,
        value: companyCurrentTextBox,
        onChange: (e, {newValue}) => setCurrentCompanyTextBox(newValue)
    }
  
    const inputPastCompanyProps = {
      placeholder: `Search for a ${'company'}`,
      value: companyPastTextBox,
      onChange: (e, {newValue}) => setPastCompanyTextBox(newValue)
    }
  
    const handleAdvancedFilterSkillsEliminate = (activeState, name) => {
      setFilterCount(activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
        FilterCount + 1)
      dispatch(setSkillsFilters([...AdvFilters.skills.map(itm => itm.name === name ? {
              name: itm.name,
              value: activeState===2 ? 0 : 2
          } : itm)]))
    }

    const handleAdvancedFilterSkillsHighlight = (activeState, name) => {
      setFilterCount(activeState===1 ? 
          FilterCount - 1 :
        activeState===2?
          FilterCount :
        FilterCount + 1)
      dispatch(setSkillsFilters([...AdvFilters.skills.map(itm => itm.name === name ? {
            name: itm.name,
            value: activeState===1 ? 0 : 1
        } : itm)]))
    }

    const handleAdvancedFilterSchoolsEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setSchoolFilters([...AdvFilters.school.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    }
    const handleAdvancedFilterSchoolsHighlight  = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setSchoolFilters([...AdvFilters.school.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }

    const handleAdvancedFilterEducationEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setEducationFilters([...AdvFilters.education.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    }
    const handleAdvancedFilterEducationHighlight  = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setEducationFilters([...AdvFilters.education.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }

    // const handleSchoolsFilterCheckbox = (e) => {
    //   setFilterCount(e.target.checked ? FilterCount + 1 : FilterCount - 1)
    //   setSchoolsFilterList([...schoolsFilterList.map(itm => {
    //     if (itm.name === e.target.name) 
    //       return {
    //         name: itm.name,
    //         value: !itm.value
    //       }
    //     return itm
    //   })])
    // }

    const handleCompanyFilterCheckbox = (e) => {
      setFilterCount(e.target.checked ? FilterCount + 1 : FilterCount - 1)
      setCompanyFilterList([...companyFilterList.map(itm => {
        if (itm.name === e.target.name) 
          return {
            name: itm.name,
            value: !itm.value
          }
        return itm
      })])
    }


    // const onSuggestionsFetchRequested = useCallback(_.debounce(({ value }) => {
    // dispatch(fetchLocations(value))
    // }, 200),
    // []
    // )


    const onCurrentIndustrySuggestionsFetchRequested = useCallback(_.debounce(async ({value}) => {
      try {
          const response = await callLinkedinApi(`/voyager/api/typeahead/hitsV2?keywords=${
              encodeURIComponent(value)
          }&origin=OTHER&q=type&type=INDUSTRY`, {
              method: 'GET',
              headers: {
                  'x-li-lang': 'en_US',
                  'x-restli-protocol-version': '2.0.0'
              }
          })

          const industrySuggestions = response.elements.map(item => item.text.text)
          setCurrentIndustrySuggestions(industrySuggestions)


      } catch (e) {
          throw e
      }

  }, 200), [])


  const onPastIndustrySuggestionsFetchRequested = useCallback(_.debounce(async ({value}) => {
    try {
        const response = await callLinkedinApi(`/voyager/api/typeahead/hitsV2?keywords=${
            encodeURIComponent(value)
        }&origin=OTHER&q=type&type=INDUSTRY`, {
            method: 'GET',
            headers: {
                'x-li-lang': 'en_US',
                'x-restli-protocol-version': '2.0.0'
            }
        })

        const industrySuggestions = response.elements.map(item => item.text.text)
        setPastIndustrySuggestions(industrySuggestions)


    } catch (e) {
        throw e
    }

}, 200), [])


// const onLocationSuggestionsFetchRequested = useCallback(_.debounce(({ value }) => {
//   dispatch(fetchLocations(value))
// }, 200),
//   []
// )

// const onLocationSuggestionsClearRequested = () => {
//   dispatch(clearLocationSuggestions())
// }
    const onCurrentIndustrySuggestionsClearRequested = () => setCurrentIndustrySuggestions([])

    const onCurrentIndustrySuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {
      setFilterCount(FilterCount + 1)
      dispatch(setCurrentIndustryFilters([{
      name: suggestionValue,
      value: 1}, 
      ...AdvFilters.currentIndustry.filter(itm => itm.name !== suggestionValue )]))

        // setIndustryFilterList([
        //     {
        //         name: suggestionValue,
        //         value: true
        //     },
        //     ...industryFilterList.filter(itm => itm.name !== suggestionValue)
        // ])
        setCurrentIndustryTextBox('')
    }

    const onPastIndustrySuggestionsClearRequested = () => setPastIndustrySuggestions([])

    const onPastIndustrySuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {
        setFilterCount(FilterCount + 1)
        dispatch(setPastIndustryFilters([{
        name: suggestionValue,
        value: 1}, 
        ...AdvFilters.pastIndustry.filter(itm => itm.name !== suggestionValue )]))
        // setIndustryFilterList([
        //     {
        //         name: suggestionValue,
        //         value: true
        //     },
        //     ...industryFilterList.filter(itm => itm.name !== suggestionValue)
        // ])
        setPastIndustryTextBox('')
    }
    const inputCurrentIndustryProps = {
        placeholder: `Search for a ${'industry'}`,
        value: industryCurrentTextBox,
        onChange: (e, {newValue}) => setCurrentIndustryTextBox(newValue)
    }
    const inputPastIndustryProps = {
        placeholder: `Search for a ${'industry'}`,
        value: industryPastTextBox,
        onChange: (e, {newValue}) => setPastIndustryTextBox(newValue)
    }

  
    const onCurrentTitleSuggestionsFetchRequested = ({value}) => setCurrentTitleSuggestions(getTitleSuggestions(value))
    const onCurrentTitleSuggestionsClearRequested = () => setCurrentTitleSuggestions([])

    const onCurrentTitleSuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {

      setFilterCount(FilterCount + 1)
      dispatch(setCurrentTitleFilters([{
        name: suggestionValue,
        value: 1}, 
        ...AdvFilters.currentTitle.filter(itm => itm.name !== suggestionValue )]))
        // setTitleFilterList([
        //     {
        //         name: suggestionValue,
        //         value: true
        //     },
        //     ...titleFilterList.filter(itm => itm.name !== suggestionValue)
        // ])
        setCurrentTitleTextBox('')
    }
    const onPastTitleSuggestionsFetchRequested = ({value}) => setPastTitleSuggestions(getTitleSuggestions(value))
    const onPastTitleSuggestionsClearRequested = () => setPastTitleSuggestions([])

    const onPastTitleSuggestionSelected = (event, {
        suggestion,
        suggestionValue,
        suggestionIndex,
        sectionIndex,
        method
    }) => {

      setFilterCount(FilterCount + 1)
      dispatch(setPastTitleFilters([{
        name: suggestionValue,
        value: 1}, 
        ...AdvFilters.pastTitle.filter(itm => itm.name !== suggestionValue )]))
        // setTitleFilterList([
        //     {
        //         name: suggestionValue,
        //         value: true
        //     },
        //     ...titleFilterList.filter(itm => itm.name !== suggestionValue)
        // ])
        setPastTitleTextBox('')
    }
    const inputCurrentTitleProps = {
        placeholder: `Search for a ${'title'}`,
        value: titleCurrentTextBox,
        onChange: (e, {newValue}) => setCurrentTitleTextBox(newValue)
    }
    const inputPastTitleProps = {
        placeholder: `Search for a ${'title'}`,
        value: titlePastTextBox,
        onChange: (e, {newValue}) => setPastTitleTextBox(newValue)
    }


    const handleAdvancedFilterCurrentCompanyEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentCompanyFilters([...AdvFilters.currentCompany.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))  
    }

    const handleAdvancedFilterCurrentCompanyHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentCompanyFilters([...AdvFilters.currentCompany.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }

    const handleAdvancedFilterPastCompanyEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastCompanyFilters([...AdvFilters.pastCompany.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    }

    const handleAdvancedFilterPastCompanyHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastCompanyFilters([...AdvFilters.pastCompany.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }

    const handleAdvancedFilterCurrentIndustryEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentIndustryFilters([...AdvFilters.currentIndustry.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))  
    }

    const handleAdvancedFilterCurrentIndustryHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentIndustryFilters([...AdvFilters.currentIndustry.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }

    const handleAdvancedFilterPastIndustryEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastIndustryFilters([...AdvFilters.pastIndustry.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    }

    const handleAdvancedFilterPastIndustryHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastIndustryFilters([...AdvFilters.pastIndustry.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }
    const handleAdvancedFilterCurrentTitleEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentTitleFilters([...AdvFilters.currentTitle.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    } 
    const handleAdvancedFilterCurrentTitleHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setCurrentTitleFilters([...AdvFilters.currentTitle.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }
    const handleAdvancedFilterPastTitleEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastTitleFilters([...AdvFilters.pastTitle.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    } 
    const handleAdvancedFilterPastTitleHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setPastTitleFilters([...AdvFilters.pastTitle.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }
    
    const handleAdvancedFilterLocationEliminate = (activeState, name) => {
      setFilterCount(
        activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
          FilterCount + 1)
      dispatch(setLocationFilters([...AdvFilters.location.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===2 ? 0 : 2
      } : itm)]))
    } 
    const handleAdvancedFilterLocationHighlight = (activeState, name) => {
      setFilterCount( 
        activeState===1 ? 
          FilterCount - 1 :
        activeState===2 ?
          FilterCount :
          FilterCount + 1)
      dispatch(setLocationFilters([...AdvFilters.location.map(itm => itm.name === name ? {
        name: itm.name,
        value: activeState===1 ? 0 : 1
      } : itm)]))
    }
    

    const handleAdvancedFilterClear = () => {
      setFilterCount(0)
      dispatch(clearAdvancedFilters())
      dispatch(clearScoringFilter())

        manualApiCall('/api/auth/user/activity/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {"actionName": "CLEAR_ADVANCED_FILTER"}
            )
        })

        const params = qs.parse(search)

        
        const newParams = _.omit(params, [...advFilterList, ...scrFilterList])

        dispatch(unselectAllProspects())
        setSelectAllProspectsFlag(false)
        push(`/html/job.html?${qs.stringify(newParams)}`)

    }

    const actionApiAdvFilter = (actionType, flag=false) => {
      manualApiCall('/api/auth/user/activity/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
              "actionName": flag ? 
              `APPLY_SCORING_FILTER_${actionType}_FILTER` :
              `APPLY_ADVANCED_FILTER_${actionType}_FILTER`
          })
        })
    }


    const handleAdvancedFilterCancel = () => {
        setFilterCount(0)
        dispatch(clearAdvancedFilters())
        dispatch(clearScoringFilter())
        
  
        manualApiCall('/api/auth/user/activity/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {"actionName": `ADVANCED_FILTER_CANCEL`}
            )
        })

        setShow(false)
    }

    const handleClickApply = () => {
        let params = qs.parse(search)

        params = _.omit(params, [...advFilterList, ...scrFilterList])

        if (AdvFilters.visa.filter(item => item.value===1).length > 0) {
          params['hV'] = AdvFilters.visa.filter(item => item.value===1).map(item => item.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_VISA')
        }

        if (AdvFilters.visa.filter(item => item.value===2).length > 0) {
          params['eV'] = AdvFilters.visa.filter(item => item.value===2).map(item => item.name).join('||')
          actionApiAdvFilter('ELIMINATE_VISA')
        }

        if (AdvFilters.location.filter(item => item.value===1).length > 0) {
          params['hL'] = AdvFilters.location.filter(item => item.value===1).map(item => item.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_LOCATION')
        }

        if (AdvFilters.location.filter(item => item.value===2).length > 0) {
          params['eL'] = AdvFilters.location.filter(item => item.value===2).map(item => item.name).join('||')
          actionApiAdvFilter('ELIMINATE_LOCATION')
        }


        if (AdvFilters.skillsStrict) {
          params['sS'] = 'strict'
          actionApiAdvFilter('STRICT_SKILLS')
        }

        if (AdvFilters.skills.filter(item => item.value===1).length > 0) {
          params['hS'] = AdvFilters.skills.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_SKILLS')
        }

        if (AdvFilters.skills.filter(item => item.value===2).length > 0) {
          params['eS'] = AdvFilters.skills.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_SKILLS')
        }


        if (AdvFilters.school.filter(item => item.value===1).length > 0) {
          params['hSS'] = AdvFilters.school.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_SCHOOLS')
        }

        if (AdvFilters.school.filter(item => item.value===2).length > 0) {
          params['eSS'] = AdvFilters.school.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_SCHOOLS')
        }

        if (AdvFilters.education.filter(item => item.value===1).length > 0) {
          params['hE'] = AdvFilters.education.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_EDUCATION')
        }

        if (AdvFilters.education.filter(item => item.value===2).length > 0) {
          params['eE'] = AdvFilters.education.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_EDUCATION')
        }

        if (AdvFilters.educationStrict) {
          params['eDS'] = 'strict'
          actionApiAdvFilter('STRICT_EDUCATION')
        }
        
        if (AdvFilters.currentCompany.filter(item => item.value===1).length > 0) {
          params['hCC'] = AdvFilters.currentCompany.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_CURRENT_COMPANY')
        }

        if (AdvFilters.currentCompany.filter(item => item.value===2).length > 0) {
          params['eCC'] = AdvFilters.currentCompany.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_CURRENT_COMPANY')
        }
        
        if (AdvFilters.pastCompany.filter(item => item.value===1).length > 0) {
          params['hPC'] = AdvFilters.pastCompany.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_PAST_COMPANY')
        }

        if (AdvFilters.pastCompany.filter(item => item.value===2).length > 0) {
          params['ePC'] = AdvFilters.pastCompany.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_PAST_COMPANY')
        }
        

        if (AdvFilters.companySize.filter(item => item.value===2).length > 0) {
          params['eCSR'] = AdvFilters.companySize.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_COMPANY_SIZE')
        }
        if (AdvFilters.companySize.filter(item => item.value===1).length > 0) {
          params['hCSR'] = AdvFilters.companySize.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_COMPANY_SIZE')
        }
        
        
        
        if (AdvFilters.currentTitle.filter(item => item.value===1).length > 0) {
          params['hCT'] = AdvFilters.currentTitle.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_CURRENT_TITLE')
        }

        if (AdvFilters.currentTitle.filter(item => item.value===2).length > 0) {
          params['eCT'] = AdvFilters.currentTitle.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_CURRENT_TITLE')
        }
        
        if (AdvFilters.pastTitle.filter(item => item.value===1).length > 0) {
          params['hPT'] = AdvFilters.pastTitle.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_PAST_TITLE')
        }

        if (AdvFilters.pastTitle.filter(item => item.value===2).length > 0) {
          params['ePT'] = AdvFilters.pastTitle.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_PAST_TITLE')
        }
        
        if (AdvFilters.currentTitleStrict) {
          params['cTS'] = 'strict'
          actionApiAdvFilter('CURRENT_TITLE_STRICT')
        }

        if (AdvFilters.pastTitleStrict) {
          params['pTS'] = 'strict'
          actionApiAdvFilter('PAST_TITLE_STRICT')
        }

        
        
        if (AdvFilters.currentIndustry.filter(item => item.value===1).length > 0) {
          params['hCI'] = AdvFilters.currentIndustry.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_CURRENT_INDUSTRY')
        }

        if (AdvFilters.currentIndustry.filter(item => item.value===2).length > 0) {
          params['eCI'] = AdvFilters.currentIndustry.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_CURRENT_INDUSTRY')
        }
        
        if (AdvFilters.pastIndustry.filter(item => item.value===1).length > 0) {
          params['hPI'] = AdvFilters.pastIndustry.filter(itm => itm.value===1).map(itm => itm.name).join('||')
          actionApiAdvFilter('HIGHLIGHT_PAST_INDUSTRY')
        }

        if (AdvFilters.pastIndustry.filter(item => item.value===2).length > 0) {
          params['ePI'] = AdvFilters.pastIndustry.filter(itm => itm.value===2).map(itm => itm.name).join('||')
          actionApiAdvFilter('ELIMINATE_PAST_INDUSTRY')
        }


        if (AdvFilters.totalExperience.active) {
          params['tE'] = `${AdvFilters.totalExperience.value.min}||${AdvFilters.totalExperience.value.max}`
          actionApiAdvFilter('TOTAL_EXPERIENCE')
        }
        

        if (AdvFilters.relevantExperience.active) {
          params['rE'] = `${AdvFilters.relevantExperience.value.min}||${AdvFilters.relevantExperience.value.max}`
          actionApiAdvFilter('RELEVANT_EXPERIENCE')
        } 
        
        if (ScoringFilters.titleScore.active) {
            params['tSF'] = `${ScoringFilters.titleScore.value}`
            actionApiAdvFilter('TITLE', true)
        }   
        
        if (ScoringFilters.skillScore.active) {
            params['sSF'] = `${ScoringFilters.skillScore.value}`
            actionApiAdvFilter('SKILL', true)
        }   
        
        if (ScoringFilters.experienceScore.active) {
            params['expSF'] = `${ScoringFilters.experienceScore.value}`
            actionApiAdvFilter('EXPERIENCE', true)
        }   
        
        if (ScoringFilters.educationScore.active) {
            params['edSF'] = `${ScoringFilters.educationScore.value}`
            actionApiAdvFilter('EDUCATION', true)
        }   
        
        if (ScoringFilters.industryScore.active) {
            params['iSF'] = `${ScoringFilters.industryScore.value}`
            actionApiAdvFilter('INDUSTRY', true)
        }          
        
        console.log("ADVFILTER: ",qs.stringify(params))
        
        dispatch(unselectAllProspects())
        setSelectAllProspectsFlag(false)
        push(`/html/job.html?${qs.stringify(params)}`)
        
        window.scrollTo({top: 0, behavior: 'smooth'});

        setShow(false)
    }

    const handleDisabled = (e) => {
        highRef.current.style.backgroundColor = '#EEF3FB'
        elimRef.current.style.backgroundColor = '#EEF3FB'
        setTimeout(() => {
            elimRef.current.style.backgroundColor = 'white'
            highRef.current.style.backgroundColor = 'white'
        }, 500)
    }

    const handleAdvancedFilterVisaEliminate = (activeState, name) => {
      setFilterCount(activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
        FilterCount + 1)
      dispatch(setVisaFilters([...AdvFilters.visa.map(itm => itm.name === name ? {
              name: itm.name,
              value: activeState===2 ? 0 : 2
          } : itm)]))
    }
    const handleAdvancedFilterVisaHighlight = (activeState, name) => {
      setFilterCount(activeState===1 ? 
          FilterCount - 1 :
        activeState===2?
          FilterCount :
        FilterCount + 1)
      dispatch(setVisaFilters([...AdvFilters.visa.map(itm => itm.name === name ? {
              name: itm.name,
              value: activeState===1 ? 0 : 1
          } : itm)]))
    }

    const handleAdvancedFilterCompanySizeEliminate = (activeState, name) => {
      setFilterCount(activeState===2 ? 
          FilterCount - 1 : 
        activeState===1?
          FilterCount :
        FilterCount + 1)
      dispatch(setCompanySizeFilter([...AdvFilters.companySize.map(itm => itm.name === name ? {
              name: itm.name,
              value: activeState===2 ? 0 : 2
          } : itm)]))
    }
    const handleAdvancedFilterCompanySizeHighlight = (activeState, name) => {
      setFilterCount(activeState===1 ? 
          FilterCount - 1 :
        activeState===2?
          FilterCount :
        FilterCount + 1)
      dispatch(setCompanySizeFilter([...AdvFilters.companySize.map(itm => itm.name === name ? {
              name: itm.name,
              value: activeState===1 ? 0 : 1
          } : itm)]))
    }
    const handleStrictSkill = (e) => {
      if(e.target.id==="sSOR" && AdvFilters.skillsStrict)
          dispatch(setStrictSkills(false))

      else if(e.target.id==="sSAND" && !AdvFilters.skillsStrict)
          dispatch(setStrictSkills(true))

      console.log(AdvFilters.skillsStrict)
    }

    // const handleAdvFilterCompanySizeKeyPress = (e) => {

    //   console.log(e)
    //     console.log("++++++++++++++++++++++++++++++++")
    //     switch (e.target.name){
    //       case "mininumCompanySize":
    //         if(parseInt(e.target.value)<10){
    //           console.log("-------------------------------")
    //           dispatch(setCompanySizeFilter({min:1, max:AdvFilters.companySize.max}))}
    //         break
    //       case "maximumCompanySize":
    //         if(parseInt(e.target.value)<10){
    //           console.log("____________________________________-")
    //           dispatch(setCompanySizeFilter({min:AdvFilters.companySize.min, max:AdvFilters.companySize.min+1}))}
    //         break
    //     }
    // }

    const handleAdvFilterCompanySizeRange = (value) => {
      dispatch(setCompanySizeFilter(value)) 
    }

    const handleTotalExpChangeRange = (value) => {
      dispatch(setTotalExperienceFilter(value))
    }
    
    const handleRelevantExpChangeRange = (value) => {
      dispatch(setRelevantExperienceFilter(value))
    }
    
    const handleCurrentTitleStrict = (e) => {
      // setFilterCount(AdvFilters.currentTitleStrict ? 
      //   FilterCount - 1 :
      //   FilterCount + 1)
      dispatch(toggleStrictCurrentTitle())
    }

    const handlePastTitleStrict = (e) => {
      // setFilterCount(AdvFilters.pastTitleStrict ? 
      //   FilterCount - 1 :
      //   FilterCount + 1)
      dispatch(toggleStrictPastTitle())
    }

    const handleEducationStrict = (e) => {
      // setFilterCount(AdvFilters.pastTitleStrict ? 
      //   FilterCount - 1 :
      //   FilterCount + 1)
      dispatch(toggleStrictEducation())
    }

    return (
        <React.Fragment>
            <Modal className="advancedFilterSection"
                isOpen={Show}>
                <ModalBody>
                    <Card>
                        <CardHeader className="filterNavHeader"
                            style={
                                {padding: "16px"}
                        }>
                            <nav className="filterNav">
                                <div className="leftFilterNav">
                                    {/* <Button 
                    outline color="secondary" 
                    className="filterBackButton" 
                    onClick={handleBackClick}>
                    <img src={BackButtonIcon} alt="back"/>
                  </Button> */}
              <h4 className="filterNavHeading">Advanced Filters</h4>
            </div>
            <span className="rightFilterNav">
              {FilterCount > 0 && <a className="filterClear"
                  onClick={handleAdvancedFilterClear}>
                  Clear({
                  `${FilterCount}`
              })
              </a>
            }
            <span style={
                {
                    borderRight: "1px solid #E6E9ED",
                    height: "42px"
                }
            }/>
            <Button outline color="primary" className="filterCancelButton"
                onClick={handleAdvancedFilterCancel}>Cancel</Button>
            <Button color="primary" className="filterApplyButton"
                onClick={handleClickApply}>Apply
            </Button>
            </span>
                </nav>
            </CardHeader>
            <CardBody> 
              <div className="bottomFilterBodyContainer" >
              <span className="bottomFilterBody">
                <span className='suggestionMainSpanContainer'>
                  <div className="filterSubHeadingContainer">
                    <h3 className="filterSubHeading">Skills</h3>
                    <div className="skillStrictButtonContainer">
                      <Button 
                        id="sSOR"
                        ref={sSOrRef}
                        outline
                        className={`${!AdvFilters.skillsStrict ?
                            "skillStrictToggle ": 
                          ""}skillStrictButton`}
                        onClick={handleStrictSkill}>
                          OR
                      </ Button>
                      <Button 
                        id="sSAND"
                        ref={sSAndRef}
                        outline
                        className={`${AdvFilters.skillsStrict ?
                          "skillStrictToggle ": 
                        ""}skillStrictButton`}
                        onClick={handleStrictSkill}>
                          AND
                      </Button>
                    </div>
                  </div>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                    }}
                      suggestions={skillsSuggestions}
                      onSuggestionsFetchRequested={onSkillsSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSkillsSuggestionsClearRequested}
                      onSuggestionSelected={onSkillsSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputSkillsProps}/>
                    <div className="AdvancedVisaFilterPillContainer">
                      {AdvFilters.skills.map((itm, idx) => (
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterSkillsEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterSkillsHighlight} />)
                      )} 
                    </div>
                  </FormGroup>
                </span>
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Schools</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {schoolsSuggestions}
                      onSuggestionsFetchRequested={onSchoolsSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSchoolsSuggestionsClearRequested}
                      onSuggestionSelected={onSchoolsSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputSchoolsProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.school.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterSchoolsEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterSchoolsHighlight} />
                        )
                      }
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterNewLine" />
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                    <h3 className="filterSubHeading">Education</h3> 
                    <label className="TitleSwitchContainer">
                      <span>Strict Match</span>
                      <Toggle
                        icons={false}
                        defaultChecked={AdvFilters.educationStrict}
                        onChange={handleEducationStrict}
                      />
                    </label>
                  </span>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {EducationSuggestions}
                      onSuggestionsFetchRequested={onEducationSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onEducationSuggestionsClearRequested}
                      onSuggestionSelected={onEducationSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputEducationProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.education.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterEducationEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterEducationHighlight} />
                        )
                      }
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterDevider" />
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                    <h3 className="filterSubHeading">
                      Current Title
                    </h3>
                    <label className="TitleSwitchContainer">
                      <span>Strict Match</span>
                      <Toggle
                        icons={false}
                        defaultChecked={AdvFilters.currentTitleStrict}
                        onChange={handleCurrentTitleStrict}
                      />
                    </label>
                  </span>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {CurrentTitleSuggestions}
                      onSuggestionsFetchRequested={onCurrentTitleSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onCurrentTitleSuggestionsClearRequested}
                      onSuggestionSelected={onCurrentTitleSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputCurrentTitleProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.currentTitle.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterCurrentTitleEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterCurrentTitleHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                    <h3 className="filterSubHeading">
                      Past Title
                    </h3>
                    <label className="TitleSwitchContainer">
                      <span>Strict Match</span>
                      <Toggle
                        icons={false}
                        defaultChecked={AdvFilters.pastTitleStrict}
                        onChange={handlePastTitleStrict}
                      />
                    </label>
                  </span>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {PastTitleSuggestions}
                      onSuggestionsFetchRequested={onPastTitleSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onPastTitleSuggestionsClearRequested}
                      onSuggestionSelected={onPastTitleSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputPastTitleProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.pastTitle.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterPastTitleEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterPastTitleHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterDevider" />
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Current Company</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {CurrentCompanySuggestions}
                      onSuggestionsFetchRequested={onCurrentCompanySuggestionsFetchRequested}
                      onSuggestionsClearRequested={onCurrentCompanySuggestionsClearRequested}
                      onSuggestionSelected={onCurrentCompanySuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputCurrentCompanyProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.currentCompany.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterCurrentCompanyEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterCurrentCompanyHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Past Company</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {PastCompanySuggestions}
                      onSuggestionsFetchRequested={onPastCompanySuggestionsFetchRequested}
                      onSuggestionsClearRequested={onPastCompanySuggestionsClearRequested}
                      onSuggestionSelected={onPastCompanySuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputPastCompanyProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                    {AdvFilters.pastCompany.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterPastCompanyEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterPastCompanyHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterNewLine" />
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                    {/* <Input
                      className='checkBox'
                      type='checkbox'
                      onChange={() => dispatch(toggleCompanySizeFilter())}
                      checked={AdvFilters.companySize.active}
                    /> */}
                    <h3 className="filterSubHeading">Current Company Size</h3>
                  </span>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.companySize.map((itm, idx) => <AdvancedFilterPillButton 
                        key={idx}
                        activeState={itm.value}
                        filterName={itm.name} 
                        handleAdvancedFilterPillEliminate={handleAdvancedFilterCompanySizeEliminate} 
                        handleAdvancedFilterPillHighlight={handleAdvancedFilterCompanySizeHighlight} />)}
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterDevider" />
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                      <Input
                        className='checkBox'
                        type='checkbox'
                        onChange={(e) => {
                          if(e.target.checked)
                            setFilterCount(prev => prev + 1)
                          else 
                            setFilterCount(prev => prev - 1)
                          dispatch(toggleTotalExperienceFilter())}}
                        checked={AdvFilters.totalExperience.active}
                      />
                      <h3 className="filterSubHeading">
                        Total Experience
                      </h3>
                      <Label className="sliderFilterLablePosition sliderFilterLable">
                          {`${AdvFilters.totalExperience.value.min} to ${AdvFilters.totalExperience.value.max} Years`}
                      </Label>
                    </span>
                    <FormGroup 
                      className="AdvancedVisaFilterPillContainer">
                      <div className="advExpSliderContainer">
                        <InputRange 
                          maxValue={30}
                          minValue={0}
                          // formatLabel={value => `${value} years`}
                          value={AdvFilters.totalExperience.value}
                          onChange={handleTotalExpChangeRange}
                          />
                        </div>
                      </FormGroup>
                </span>
                <span className='suggestionMainSpanContainer'>
                  <span className="advFilterCheckboxContainer">
                      <Input
                        className='checkBox'
                        type='checkbox'
                        onChange={(e) => {
                          if(e.target.checked)
                            setFilterCount(prev => prev + 1)
                          else 
                            setFilterCount(prev => prev - 1)
                          dispatch(toggleRelevantExperienceFilter())}}
                        checked={AdvFilters.relevantExperience.active}
                      />
                      <h3 className="filterSubHeading">
                        Relevant Experience
                      </h3>
                      <Label className="sliderFilterLablePosition sliderFilterLable">
                          {`${AdvFilters.relevantExperience.value.min} to ${AdvFilters.relevantExperience.value.max} Years`}
                      </Label>
                    </span>
                    <FormGroup 
                      className="AdvancedVisaFilterPillContainer">
                      <div className="advExpSliderContainer">
                        <InputRange
                          maxValue={30}
                          minValue={0}
                          // formatLabel={value => `${value} Yrs`}
                          value={AdvFilters.relevantExperience.value}
                          onChange={handleRelevantExpChangeRange}
                          />
                        </div>
                      </FormGroup>
                </span>
                <hr className="advFilterDevider" /> 
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Current Industry</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {CurrentIndustrySuggestions}
                      onSuggestionsFetchRequested={onCurrentIndustrySuggestionsFetchRequested}
                      onSuggestionsClearRequested={onCurrentIndustrySuggestionsClearRequested}
                      onSuggestionSelected={onCurrentIndustrySuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputCurrentIndustryProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                      {AdvFilters.currentIndustry.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterCurrentIndustryEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterCurrentIndustryHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Past Industry</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {PastIndustrySuggestions}
                      onSuggestionsFetchRequested={onPastIndustrySuggestionsFetchRequested}
                      onSuggestionsClearRequested={onPastIndustrySuggestionsClearRequested}
                      onSuggestionSelected={onPastIndustrySuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputPastIndustryProps}
                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                    {AdvFilters.pastIndustry.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterPastIndustryEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterPastIndustryHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>
                <hr className="advFilterDevider" />
                <span className='suggestionMainSpanContainer'>
                  <h3 className="filterSubHeading">Location</h3>
                  <FormGroup className='suggestionFormGroupContainer'>
                    <Autosuggest 
                      theme={{
                        input: 'adv-filter-ip',
                        suggestion: 'suggestion-item',
                        suggestionsContainer: 'autosuggest-suggestions-container'
                      }}
                      suggestions = {LocationSuggestions}
                      onSuggestionsFetchRequested={onLocationSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onLocationSuggestionsClearRequested}
                      onSuggestionSelected={onLocationSuggestionSelected}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputLocationProps}

                    />
                    <div className='AdvancedVisaFilterPillContainer'>
                    {AdvFilters.location.map((itm, idx) =>
                        <AdvancedFilterPillButton 
                          key={idx}
                          activeState={itm.value}
                          filterName={itm.name} 
                          handleAdvancedFilterPillEliminate={handleAdvancedFilterLocationEliminate} 
                          handleAdvancedFilterPillHighlight={handleAdvancedFilterLocationHighlight} />
                      )}
                    </div>
                  </FormGroup>
                </span>  
                <span className='suggestionMainSpanContainer'>
                    <h3 className="filterSubHeading">Visa Type</h3>
                    <FormGroup className='suggestionFormGroupContainer'>
                      <div className="AdvancedVisaFilterPillContainer" >
                        {AdvFilters.visa.map((itm, idx) => ( 
                          <AdvancedFilterPillButton 
                            key={idx}
                            activeState={itm.value}
                            filterName={itm.name} 
                            handleAdvancedFilterPillEliminate={handleAdvancedFilterVisaEliminate} 
                            handleAdvancedFilterPillHighlight={handleAdvancedFilterVisaHighlight} />))} 
                      </div>
                    </ FormGroup>
                </span>
              </span>
              <span className="scoringFilterSpan">
                    <ScoringFilterSection 
                      titleFlag= {titleFlag}
                      skillFlag={skillFlag}
                      industryFlag={industryFlag}
                      experienceFlag={experienceFlag}
                      educationFlag={educationFlag}
                      FilterCount={FilterCount}
                      setFilterCount={setFilterCount}
                      Show={Show}
                      setShow={setShow}
                      setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                      search={search}
                      push={push}
                      activeTab={activeTab}
                    />
              </span>
              </div>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default withRouter(connect(state => {
    return {AdvFilters: state.score.advancedFilters,
            ...state.jobDescription.jobLocation,
            ScoringFilters: state.score.scoringFilters    }
})(AdvanceFilterSection))
