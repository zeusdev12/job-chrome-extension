import React, { useState, useEffect } from "react";
import { CSVLink } from 'react-csv'
import qs from 'query-string'
import {
  Button,
  Card,
  CardBody,
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Tooltip
} from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { manualApiCall, simulateTimeout, transformCsvData } from '../../utils'

import { connect } from 'react-redux'

import CsvExport from './csvExport'

import AdvanceFilterTags from './AdvanceFilterTags'

import {
  
  composeMessageLoading,
  composeMessageLoaded,
  composeMessageFaliure,
  requestMeetingLoading,
  requestMeetingLoaded,
  requestMeetingFaliure,
  clearAdvancedFilters,
  clearScoringFilter,
  setDownloaded,
  archiveProspects,
  unarchiveProspects,
  selectAllProspects,
  selectTopProspects,
  unselectAllProspects,
  fetchAllProspects,
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
  setCurrentIndustryFilters,
  setPastIndustryFilters,
  setLocationFilters,
  setVisaFilters,
  setTotalExperienceFilter,
  setRelevantExperienceFilter,
  toggleTotalExperienceFilter,
  toggleRelevantExperienceFilter,
  setCompanySizeFilter,
  toggleCompanySizeFilter,
  setTitleScoringFilter,
  toggleTitleScoringFilter,
  setSkillScoringFilter,
  toggleSkillScoringFilter,
  setExperienceScoringFilter,
  toggleExperienceScoringFilter,
  setEducationScoringFilter,
  toggleEducationScoringFilter,
  setIndustryScoringFilter,
  toggleIndustryScoringFilter,
  GET_MESSAGE_SETTING_FAILURE

} from '../../actions/score'


import VectorIcon from '../../../../img/vector.svg'
import BlueVectorIcon from '../../../../img/BlueVector-down.svg'
import BluePlusIcon from '../../../../img/blue-plus-small.svg'
import BlueMinusIcon from '../../../../img/minus-small.svg'
import TrashIcon from '../../../../img/archiveIcon.svg'
import MinusIcon from '../../../../img/not-all.svg'
import BlueSortIcon from '../../../../img/sort.svg'

import UnsaveBatchProspects from '../../../../img/UnsaveBatchProspects.svg'
import RequestMeetingSequence from '../../../../img/RequestMeetingSequence.svg'
import DownloadCSV from '../../../../img/DownloadCSV.svg'
import ComposeMessageSequence from '../../../../img/ComposeMessageSequence.svg'
import UnarchiveProspectBlue from '../../../../img/unarchive.svg'

import './style.css'
// import Loader from "react-loader-spinner";
import Loader from '../../components/Loader'
import { isArrayLikeObject } from "lodash";
import { NER_HOST } from "../../../config";

const sortItems = [{
  name: 'Title',
  value: 'title_score',
  sort: 'desc',
}, {
  name: 'Skills',
  value: 'skill_score',
  sort: 'desc',
}, {
  name: 'Experience',
  value: 'experience_score',
  sort: 'desc',
}, {
  name: 'Education',
  value: 'education_score',
  sort: 'desc',
}, {
  name: 'Industry',
  value: 'industry_score',
  sort: 'desc',
}, {
  name: 'Added',
  value: 'addedAt',
  sort: 'desc',
}, {
  name: 'Added',
  value: 'addedAt',
  sort: 'asc',
}, {
  name: 'Male',
  value: 'male',
  sort: 'desc',
}, {
  name: 'Female',
  value: 'female',
  sort: 'desc',
}, {
  name: 'Age',
  value: 'age',
  sort: 'asc',
}, {
  name: 'Age',
  value: 'age',
  sort: 'desc',
}, {
  name: 'Ethnicity',
  value: 'ethnicity',
  sort: 'asc',
}, {
  name: 'Ethnicity',
  value: 'ethnicity',
  sort: 'desc',
}, {
  name: 'Messaged',
  value: 'connectMessageAt',
  sort: 'desc'
}, {
  name: 'Messaged',
  value: 'connectMessageAt',
  sort: 'asc'
}, {
  name: '1st Follow Up',
  value: 'followUpFirstMessageAt',
  sort: 'desc'
}, {
  name: '1st Follow Up',
  value: 'followUpFirstMessageAt',
  sort: 'asc'
}, {
  name: '2nd Follow Up',
  value: 'followUpSecondMessageAt',
  sort: 'desc'
}, {
  name: '2nd Follow Up',
  value: 'followUpSecondMessageAt',
  sort: 'asc'
}, {
  name: 'Replied',
  value: 'repliedAt',
  sort: 'desc'
}, {
  name: 'Replied',
  value: 'repliedAt',
  sort: 'asc'
}, {
  name: "Archived",
  value: 'archivedAt',
  sort: 'desc'
}, {
  name: "Archived",
  value: 'archivedAt',
  sort: 'asc'
}, {
  name: "Downloaded",
  value: 'downloadedAt',
  sort: 'desc'
}, {
  name: "Downloaded",
  value: 'downloadedAt',
  sort: 'asc'
}]

const filterItems = [{
  name: 'All Prospects',
  value: undefined,
  id: 1
}, {
  name: 'Saved',
  value: 'Saved',
  id: 2
}, {
  name: 'Downloaded',
  value: 'Downloaded',
  id: 3
}]



const timeFilterItems = [{
  name: 'All Time',
  value: undefined,
  id: 1
}, {
  name: 'Today',
  value: 0,
  id: 2
}, {
  name: 'Last 2 days',
  value: 2,
  id: 3
}, {
  name: 'Last week',
  value: 7,
  id: 4
}, {
  name: 'Last month',
  value: 30,
  id: 5
}]

// const actionItems = [{
//   name: 'No Action',
//   value: '',
//   id: 1
// }, {
//   name: 'Messaged',
//   value: 'sent',
//   id: 2
// }, {
//   name: 'Archived',
//   value: 'archived',
//   id: 3
// }]

const connectionItems = [{
  name: '1st Degree',
  label: 'Connections',
  value: '1',
  id: 1
}, {
  name: '2nd & 3rd Degree',
  label: 'Is 2nd or 3rd connection',
  value: '2',
  id: 2
}, {
  name: 'All Connections',
  label: 'All Connections',
  value: "all",
  id: 3
}]

let BlueIcon = BluePlusIcon

const FilterSection = (props) => {
  const [Drop1, setDrop1] = useState(false)
  const [Drop2, setDrop2] = useState(false)
  const [Drop3, setDrop3] = useState(false)
  const [Drop4, setDrop4] = useState(false)
  const [Icon, setIcon] = useState(true)
  const [SelectionPop, setSelectionPop] = useState(false)
  const [csvDownloadData, setCsvDownloadData] = useState([])

  const [fileName, setFileName] = useState('Job Title')
  const [tooltipOpenC, setTooltipOpenC] = useState(false)
  const [tooltipOpenR, setTooltipOpenR] = useState(false)
  const [archiveToolTipOpen, setArchiveToolTipOpen] = useState(false)
  const [unarchiveToolTipOpen, setUnarchiveToolTipOpen] = useState(false)
  const [ComposeMsgToolTipOpen, setComposeMsgToolTipOpen] = useState(false)
  const [RequestMeetingToolTipOpen, setRequestMeetingToolTipOpen] = useState(false)
  const [UnsaveToolTipOpen, setUnsaveToolTipOpen] = useState(false)
  const [DownloadCSVToolTipOpen, setDownloadCSVToolTipOpen] = useState(false)



  const {
    Show,
    setShow,
    ScoringFilterShow,
    setScoringFilterShow,
    SortShow,
    setSortShow,
    setView,
    selected,
    dispatch,
    totalProspects,
    csvData,
    jobTitle,
    jobId,
    SelectAllProspectsFlag,
    setSelectAllProspectsFlag,
    allProspects,
    totalRecord,

    FilterCount,
    setFilterCount,
    ScoringFilterCount,
    setScoringFilterCount,

    FirstSort,
    setFirstSort,
    SecondSort,
    setSecondSort,

    newJob,
    activeTab,
    permissions,
    isDownloading,
    isArchiving,
    isUnarchiving,

    composeMessageState,
    requestMeetingState,

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
    isLimitExceeded,
    AdvFilters,
    ScoringFilters,
    setConnectionType,
    ...rest
  } = props
  const {
    location: { search },
    history: { push }
  } = rest

  console.log('FILTER SECTION REST PROPS.....: ', rest)

  const [topProspects, setTopProspects] = useState(0)

  const qsParams = qs.parse(rest.location.search)

  const getAllProspect = async () => {
    const params = qs.parse(rest.location.search)
    return await await manualApiCall(`/api/auth/job/profile/list/advancedFilter?jId=${params.jId}${params.fS ? `&fS=${params.fS}&fSO=${params.fSO}` : ''}${params.secS ? `&secS=${params.secS}&secSO=${params.secSO}` : ''}${params.sTF ? `&sTF=${params.sTF}` : ''}${params.tF ? `&tF=${params.tF}` : ''}${params.sF ? `&sF=${params.sF}` : ''}${params.cTF ? `&cTF=${params.cTF}` : ''}${params.sS ? `&sS=${params.sS}` : ""}${params.eS ? `&eS=${params.eS}` : ""}${params.hS ? `&hS=${params.hS}` : ""}${params.eSS ? `&eSS=${params.eSS}` : ""}${params.hSS ? `&hSS=${params.hSS}` : ""}${params.eE ? `&eE=${params.eE}` : ""}${params.hE ? `&hE=${params.hE}` : ""}${params.eCT ? `&eCT=${params.eCT}` : ""}${params.hCT ? `&hCT=${params.hCT}` : ""}${params.ePT ? `&ePT=${params.ePT}` : ""}${params.hPT ? `&hPT=${params.hPT}` : ""}${params.cTS ? `&cTS=${params.cTS}` : ""}${params.pTS ? `&pTS=${params.pTS}` : ""}${params.eCC ? `&eCC=${params.eCC}` : ""}${params.hCC ? `&hCC=${params.hCC}` : ""}${params.ePC ? `&ePC=${params.ePC}` : ""}${params.hPC ? `&hPC=${params.hPC}` : ""}${params.eCSR ? `&eCSR=${params.eCSR}` : ""}${params.hCSR ? `&hCSR=${params.hCSR}` : ""}${params.eCI ? `&eCI=${params.eCI}` : ""}${params.hCI ? `&hCI=${params.hCI}` : ""}${params.ePI ? `&ePI=${params.ePI}` : ""}${params.hPI ? `&hPI=${params.hPI}` : ""}${params.eL ? `&eL=${params.eL}` : ""}${params.hL ? `&hL=${params.hL}` : ""}${params.eV ? `&eV=${params.eV}` : ""}${params.hV ? `&hV=${params.hV}` : ""}${params.tSF ? `&tSF=${params.tSF}` : ""}${params.sSF ? `&sSF=${params.sSF}` : ""}${params.expSF ? `&expSF=${params.expSF}` : ""}${params.edSF ? `&edSF=${params.edSF}` : ""}${params.iSF ? `&iSF=${params.iSF}` : ""}${params.tE ? `&tE=${params.tE}` : ""}${params.rE ? `&rE=${params.rE}` : ""}${params.eDS ? `&eDS=${params.eDS}` : ""}&pFlag=false`)
  }

  const handleDownloadCSV = async () => {
    dispatch({
      type: "SETDOWNLOADED_PROSPECTS"
    })

    let r = []

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "DOWNLOAD_CSV",
          "jobId": qsParams.jId
        })
      })

    // const data = SelectAllProspectsFlag ? allProspectsData : csvDownloadData

    if (SelectAllProspectsFlag) {

      const params = Object.keys(qsParams).reduce((obj, item) => {
        return { ...obj, [item]: encodeURIComponent(qsParams[item]) }
      }, {})


      const data = await getAllProspect()
      
      dispatch(setDownloaded(jobId, data.prospectsArray.map(itm => itm.jobProfileId), newJob, activeTab))
      r = transformCsvData(data.prospectsArray)
      setFileName(`${jobTitle}.csv`)

    } else {

      const selectedProspects = csvData.filter(item => selected.includes(item.id))

      dispatch(setDownloaded(jobId, selectedProspects.map(itm => itm.jobProfileId), newJob, activeTab))
      const data = selectedProspects
      r = transformCsvData(data)
    }

    return {
      data: r,
      filename: `${jobTitle}.csv`,
    }


  }


  const handleClickItemSecondaryFilter = (item) => {
    const {
      location: { search },
      history: { push }
    } = rest
    if (!('sF' in qs.parse(search)) || qs.parse(search)?.sF !== item.name) {
      const params = {
        ...qs.parse(search),
        sF: item.value
      }

      const qsStr = qs.stringify(params)


      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "actionName": "SECONDARY_FILTER_" + item.name.toUpperCase() })
        })
      dispatch(unselectAllProspects())
      push(`/html/job.html?${qsStr}`)

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else if (('sF' in qs.parse(search)) && "All Prospects" === item.name) {

      const qsStr = qs.stringify(_.omit(qs.parse(search), ['sF']))


      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "actionName": "SECONDARY_FILTER_" + item.name.toUpperCase() })
        })
      dispatch(unselectAllProspects())
      push(`/html/job.html?${qsStr}`)

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }



  const handleClickItemTimeFilter = (item) => {
    const {
      location: { search },
      history: { push }
    } = rest
    if (!('sTF' in qs.parse(search)) || qs.parse(search)?.sTF !== item.name) {
      const params = {
        ...qs.parse(search),
        sTF: item.value
      }

      const qsStr = qs.stringify(params)


      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "actionName": "TIME_FILTER_" + item.name.toUpperCase() })
        })
      dispatch(unselectAllProspects())
      push(`/html/job.html?${qsStr}`)
    }
    else if (('sTF' in qs.parse(search)) && "All Time" === item.name) {

      const qsStr = qs.stringify(_.omit(qs.parse(search), ['sTF']))


      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "actionName": "TIME_FILTER_" + item.name.toUpperCase() })
        })
      dispatch(unselectAllProspects())
      push(`/html/job.html?${qsStr}`)
    }
  }


  const handleClickItemFirstSort = (item) => {
    const {
      location: { search },
      history: { push }
    } = rest

    const params = {
      ...qs.parse(search),
      fS: item.value,
      fSO: item.sort || 'desc'
    }

    const qsStr = qs.stringify(params)


    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "FIRST_SORT_" + item.value.toUpperCase(),
          "jobId": qsParams.jId
        })
      })
    dispatch(unselectAllProspects())
    push(`/html/job.html?${qsStr}`)


  }

  const handleClickArchive = async () => {

    dispatch({ type: "ARCHIVE_PROSPECTS" })

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "ARCHIVE_PROSPECT",
          "jobId": qsParams.jId
        })
      })

    if (SelectAllProspectsFlag) {

      const params = Object.keys(qsParams).reduce((obj, item) => {
        return { ...obj, [item]: encodeURIComponent(qsParams[item]) }
      }, {})



      const data = await getAllProspect()
      
      dispatch(archiveProspects({ jobId: params.jId, prospects: data.prospectsArray.map(itm => itm.jobProfileId), newJob: newJob }))
    }
    else {

      const selectedProspects = csvData.filter(item => selected.includes(item.id)).map(itm => itm.jobProfileId)
      const params = qs.parse(rest.location.search)
      dispatch(archiveProspects({ jobId: params.jId, prospects: selectedProspects, newJob: newJob  }))
    }

    // dispatch(unselectAllProspects())
  }
  const handleClickUnarchive = async () => {

    dispatch({ type: "UNARCHIVE_PROSPECTS" })

    setUnarchiveToolTipOpen(false)
    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "UNARCHIVE_PROSPECT",
          "jobId": qsParams.jId
        })
      })

    const params = qs.parse(rest.location.search)
    if (SelectAllProspectsFlag) {

      const params = Object.keys(qsParams).reduce((obj, item) => {
        return { ...obj, [item]: encodeURIComponent(qsParams[item]) }
      }, {})


      const data = await getAllProspect()

      dispatch(unarchiveProspects({ jobId: params.jId, prospects: data.prospectsArray.map(itm => itm.jobProfileId), newJob:newJob }))
    }
    else {

      const selectedProspects = csvData.filter(item => selected.includes(item.id)).map(itm => itm.jobProfileId)
      const params = qs.parse(rest.location.search)
      dispatch(unarchiveProspects({ jobId: params.jId, prospects: selectedProspects, newJob:newJob }))
    }
    // const params = qs.parse(rest.location.search)
    // dispatch(unarchiveProspects({ jobId: params.extensionJobId, prospects: selected }))
    dispatch(unselectAllProspects())

  }

  const handleClickItemSecondSort = (item) => {
    const {
      location: { search },
      history: { push }
    } = rest

    const params = {
      ...qs.parse(search),
      secS: item.value,
      secSO: item.sort || 'desc'
    }

    const qsStr = qs.stringify(params)

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "SECOND_SORT_" + item.value.toUpperCase(),
          "jobId": qsParams.jId
        })
      })


    dispatch(unselectAllProspects())
    push(`/html/job.html?${qsStr}`)


  }


  const handleClickConnectionItem = (item) => {
    const {
      location: { search },
      history: { push }
    } = rest

    const params = {
      ...qs.parse(search),
      cTF: item.value,
    }

    if (item.value === "all")
      delete params.cTF

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "CONNECTION_FILTER_" + item.value.toUpperCase(),
          "jobId": qsParams.jId
        })
      })

    const qsStr = qs.stringify(params)

    dispatch(unselectAllProspects())
    push(`/html/job.html?${qsStr}`)


  }
  const handleClickSelectAll = () => {

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "TOGGLE_SELECT_ALL",
          "jobId": qsParams.jId
        })
      })

    if (SelectAllProspectsFlag) {
      setSelectAllProspectsFlag(false)
      dispatch(unselectAllProspects())
    } else {
      setSelectAllProspectsFlag(true)
      dispatch(selectAllProspects())
    }
    // selected
  }

  const handleClickSelectTop = () => {
    if (topProspects === totalRecord) {
      setSelectAllProspectsFlag(true)
    }
    else {
      setSelectAllProspectsFlag(false)
    }

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "SELECT_TOP_PROSPECTS",
          "jobId": qsParams.jId
        })
      })

    dispatch(selectTopProspects(topProspects))
  }

  const handleClearFilters = () => {
    setFilterCount(0)
    dispatch(clearAdvancedFilters())
    dispatch(clearScoringFilter())


    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "CLEAR_FILTER",
          "jobId": qsParams.jId
        })
      })

    const searchParams = qs.parse(rest.location.search)

    const newParams = {
      jId: searchParams.jId,
      isConnectPage: 1,
      fS: searchParams.fS,
      fSO: searchParams.fSO,
      secS: searchParams.secS,
      secSO: searchParams.secSO}
    
    if(searchParams.tF)
      newParams['tF'] = searchParams.tF 
    if(searchParams.tN)
      newParams['tN'] = searchParams.tN 
    if(searchParams.sF)
      newParams['sF'] = searchParams.sF 
    if(searchParams.sTF)
      newParams['sTF'] = searchParams.sTF 


    dispatch(unselectAllProspects())
    rest.history.push(`/html/job.html?${qs.stringify(newParams)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSortOpen = (e) => {

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "actionName": "OPEN_SORT" })
      })

    setFirstSort({
      sort: qsParams.fS,
      order: qsParams.fSO
    })

    setSecondSort({
      sort: qsParams.secS,
      order: qsParams.secSO
    })


    setSortShow(true)
  }



  const handleScoringFilterOpen = (e) => {
    const tCount = qsParams.tSF ? 1 : 0
    const sCount = qsParams.sSF ? 1 : 0
    const expCount = qsParams.expSF ? 1 : 0
    const edCount = qsParams.edSF ? 1 : 0
    const iCount = qsParams.iSF ? 1 : 0

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "OPEN_SCORING_FILTER",
          "jobId": qsParams.jId
        })
      })

    const sum = (tCount +
      sCount + expCount +
      edCount + iCount)


    if (tCount !== 0) {
      if (!ScoringFilters.titleScore.active)
        dispatch(toggleTitleScoringFilter())
      dispatch(setTitleScoringFilter(parseInt(qsParams.tSF)))
    }


    if (sCount !== 0) {
      if (!ScoringFilters.skillScore.active)
        dispatch(toggleSkillScoringFilter())
      dispatch(setSkillScoringFilter(parseInt(qsParams.sSF)))
    }


    if (expCount !== 0) {
      if (!ScoringFilters.experienceScore.active)
        dispatch(toggleExperienceScoringFilter())
      dispatch(setExperienceScoringFilter(parseInt(qsParams.expSF)))
    }


    if (edCount !== 0) {
      if (!ScoringFilters.educationScore.active)
        dispatch(toggleEducationScoringFilter())
      dispatch(setEducationScoringFilter(parseInt(qsParams.edSF)))
    }


    if (iCount !== 0) {
      if (!ScoringFilters.industryScore.active)
        dispatch(toggleIndustryScoringFilter())
      dispatch(setIndustryScoringFilter(parseInt(qsParams.iSF)))
    }

    setScoringFilterCount(sum)

    setScoringFilterShow(true)
  }



  const handleAdvancedFilterOpen = (e) => {

    const eVCount = qsParams.eV ? qsParams.eV.split('||').length : 0
    const hVCount = qsParams.hV ? qsParams.hV.split('||').length : 0
    const eLCount = qsParams.eL ? qsParams.eL.split('||').length : 0
    const hLCount = qsParams.hL ? qsParams.hL.split('||').length : 0
    const eSCount = qsParams.eS ? qsParams.eS.split('||').length : 0
    const hSCount = qsParams.hS ? qsParams.hS.split('||').length : 0
    const eSSCount = qsParams.eSS ? qsParams.eSS.split('||').length : 0
    const hSSCount = qsParams.hSS ? qsParams.hSS.split('||').length : 0
    const eECount = qsParams.eE ? qsParams.eE.split('||').length : 0
    const hECount = qsParams.hE ? qsParams.hE.split('||').length : 0
    const eCICount = qsParams.eCI ? qsParams.eCI.split('||').length : 0
    const ePICount = qsParams.ePI ? qsParams.ePI.split('||').length : 0
    const hCICount = qsParams.hCI ? qsParams.hCI.split('||').length : 0
    const hPICount = qsParams.hPI ? qsParams.hPI.split('||').length : 0
    const eCTCount = qsParams.eCT ? qsParams.eCT.split('||').length : 0
    const ePTCount = qsParams.ePT ? qsParams.ePT.split('||').length : 0
    const hCTCount = qsParams.hCT ? qsParams.hCT.split('||').length : 0
    const hPTCount = qsParams.hPT ? qsParams.hPT.split('||').length : 0
    const eCCCount = qsParams.eCC ? qsParams.eCC.split('||').length : 0
    const ePCCount = qsParams.ePC ? qsParams.ePC.split('||').length : 0
    const hCCCount = qsParams.hCC ? qsParams.hCC.split('||').length : 0
    const hPCCount = qsParams.hPC ? qsParams.hPC.split('||').length : 0
    const eCSRCount = qsParams.eCSR ? qsParams.eCSR.split('||').length : 0
    const hCSRCount = qsParams.hCSR ? qsParams.hCSR.split('||').length : 0
    const tECount = qsParams.tE ? 1 : 0
    const rECount = qsParams.rE ? 1 : 0
    const tCount = qsParams.tSF ? 1 : 0
    const sCount = qsParams.sSF ? 1 : 0
    const expCount = qsParams.expSF ? 1 : 0
    const edCount = qsParams.edSF ? 1 : 0
    const iCount = qsParams.iSF ? 1 : 0


    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "OPEN_ADVANCED_FILTER",
          "jobId": qsParams.jId
        })
      })

    const sum = (eVCount +
      hVCount + eLCount +
      hLCount + eSCount +
      hSCount + eSSCount +
      hSSCount + eCICount +
      eECount + hECount +
      hCICount + hPICount +
      eCTCount + ePTCount +
      hCTCount + hPTCount +
      eCCCount + ePCCount +
      hCCCount + hPCCount +
      eCSRCount + hCSRCount + 
      tECount + rECount +
      tCount + sCount +
      expCount + edCount +
      iCount) 
    
    dispatch(setStrictSkills(qsParams.sS ? qsParams.sS : false))

    if (qsParams.cTS && !AdvFilters.currentTitleStrict)
      dispatch(toggleStrictCurrentTitle())

    if (qsParams.pTS && !AdvFilters.pastTitleStrict)
      dispatch(toggleStrictPastTitle())

    if (qsParams.eDS && !AdvFilters.educationStrict)
      dispatch(toggleStrictEducation())



    if (eVCount + hVCount > 0)
      dispatch(setVisaFilters(AdvFilters.visa.map(itm =>
        eVCount > 0 && qsParams.eV.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hVCount > 0 && qsParams.hV.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eLCount + hLCount > 0)
      dispatch(setLocationFilters(AdvFilters.location.map(itm =>
        eLCount > 0 && qsParams.eL.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hLCount > 0 && qsParams.hL.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eSCount + hSCount > 0)
      dispatch(setSkillsFilters(AdvFilters.skills.map(itm =>
        eSCount > 0 && qsParams.eS.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hSCount > 0 && qsParams.hS.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eSSCount + hSSCount > 0)
      dispatch(setSchoolFilters(AdvFilters.school.map(itm =>
        eSSCount > 0 && qsParams.eSS.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hSSCount > 0 && qsParams.hSS.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eECount + hECount > 0)
      dispatch(setEducationFilters(AdvFilters.education.map(itm =>
        eECount > 0 && qsParams.eE.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hECount > 0 && qsParams.hE.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eCTCount + hCTCount > 0)
      dispatch(setCurrentTitleFilters(AdvFilters.currentTitle.map(itm =>
        eCTCount > 0 && qsParams.eCT.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hCTCount > 0 && qsParams.hCT.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eCCCount + hCCCount > 0)
      dispatch(setCurrentCompanyFilters(AdvFilters.currentCompany.map(itm =>
        eCCCount > 0 && qsParams.eCC.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hCCCount > 0 && qsParams.hCC.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (eCICount + hCICount > 0)
      dispatch(setCurrentIndustryFilters(AdvFilters.currentIndustry.map(itm =>
        eCICount > 0 && qsParams.eCI.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hCICount > 0 && qsParams.hCI.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (ePTCount + hPTCount > 0)
      dispatch(setPastTitleFilters(AdvFilters.pastTitle.map(itm =>
        ePTCount > 0 && qsParams.ePT.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hPTCount > 0 && qsParams.hPT.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    if (ePCCount + hPCCount > 0)
      dispatch(setPastCompanyFilters(AdvFilters.pastCompany.map(itm =>
        ePCCount > 0 && qsParams.ePC.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hPCCount > 0 && qsParams.hPC.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))

    // if (cSRCount !== 0){
    //   if(!AdvFilters.companySize.active)
    //     dispatch(toggleCompanySizeFilter())
    //   dispatch(setCompanySizeFilter({min:parseInt(qsParams.cSR.split('||'[0])),max:parseInt(qsParams.cSR.split('||')[1])}))
    // }

    if (ePICount + hPICount > 0)
      dispatch(setPastIndustryFilters(AdvFilters.pastIndustry.map(itm =>
        ePICount > 0 && qsParams.ePI.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hPICount > 0 && qsParams.hPI.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))


    if (eCSRCount + hCSRCount > 0)
      dispatch(setCompanySizeFilter(AdvFilters.companySize.map(itm =>
        eCSRCount > 0 && qsParams.eCSR.split('||').includes(itm.name) ?
          { name: itm.name, value: 2 } :
          hCSRCount > 0 && qsParams.hCSR.split('||').includes(itm.name) ?
            { name: itm.name, value: 1 } : itm)))


    if (tECount === 1) {
      if (!AdvFilters.totalExperience.active)
        dispatch(toggleTotalExperienceFilter())
      dispatch(setTotalExperienceFilter({ min: parseInt(qsParams.tE.split('||')[0]), max: parseInt(qsParams.tE.split('||')[1]) }))
    }

    if (rECount === 1) {
      if (!AdvFilters.relevantExperience.active)
        dispatch(toggleRelevantExperienceFilter())
      dispatch(setRelevantExperienceFilter({ min: parseInt(qsParams.rE.split('||')[0]), max: parseInt(qsParams.rE.split('||')[1]) }))
    }


    if (tCount !== 0){
      if(!ScoringFilters.titleScore.active)
        dispatch(toggleTitleScoringFilter())
      dispatch(setTitleScoringFilter(parseInt(qsParams.tSF)))
    }
    

    if (sCount !== 0){
      if(!ScoringFilters.skillScore.active)
        dispatch(toggleSkillScoringFilter())
      dispatch(setSkillScoringFilter(parseInt(qsParams.sSF)))
    }
    

    if (expCount !== 0){
      if(!ScoringFilters.experienceScore.active)
        dispatch(toggleExperienceScoringFilter())
      dispatch(setExperienceScoringFilter(parseInt(qsParams.expSF)))
    }
    

    if (edCount !== 0){
      if(!ScoringFilters.educationScore.active)
        dispatch(toggleEducationScoringFilter())
      dispatch(setEducationScoringFilter(parseInt(qsParams.edSF)))
    }
    

    if (iCount !== 0){
      if(!ScoringFilters.industryScore.active)
        dispatch(toggleIndustryScoringFilter())
      dispatch(setIndustryScoringFilter(parseInt(qsParams.iSF)))
    }
    

    setFilterCount(sum)

    setShow(true)
  }


  const secondaryFilter = qsParams?.sF ? filterItems.filter(it => it.value === qsParams.sF)[0].name : 'All Prospects'

  const timeFilter = qsParams?.sTF ? timeFilterItems.filter(it => it.value === parseInt(qsParams.sTF))[0].name : 'All Time'

  const firstSort = {...sortItems.filter(it => it.value === qsParams.fS && it.sort === qsParams.fSO)[0]}

  const secondSort = {...sortItems.filter(it => it.value === qsParams.secS && it.sort === qsParams.secSO)[0]}


  let filterCount = Object.keys(qsParams).length - 2
  console.log("===================================================")
  console.log(filterCount)
  if ('fS' in qsParams) {
    filterCount -= 2
  }
  if ('secS' in qsParams) {
    filterCount -= 2
  }
  if ('cTF' in qsParams) {
    filterCount -= 1
  }
  if ('tF' in qsParams) {
    filterCount -= 1
  }
  if ('tN' in qsParams) {
    filterCount -= 1
  }
  if ('sS' in qsParams) {
    filterCount -= 1
  }
  if ('cTS' in qsParams) {
    filterCount -= 1
  }
  if ('pTS' in qsParams) {
    filterCount -= 1
  }
  if ('eDS' in qsParams) {
    filterCount -= 1
  }
  if ('sF' in qsParams) {
    filterCount -= 1
  }
  if ('sTF' in qsParams) {
    filterCount -= 1
  }


  console.log(filterCount)

  return (
    <React.Fragment>
      {/* {<div className="collapsible" style={{ display: Show ? 'none' : 'block' }} >
        <Collapse isOpen={Icon}>
          <Card className="dropcard">
            <CardBody className="dropcardbody">
              <div className="dropdownContainer">
                <div className="leftFilerNavBarContainer"> */}
                {/* {(qsParams?.tF !== 'Other' && qsParams?.tF!=='Replied') &&
                  <Dropdown isOpen={Drop1} toggle={() => setDrop1(!Drop1)}>
                    <DropdownToggle className="dropDownButtons" outline color="primary" onClick={() => setDrop1(!Drop1)}>
                      <p className="dropdowntext">{
                        qsParams.cTF ?
                          connectionItems.filter(item => item.id == qsParams.cTF)[0].name
                          : 'All Connections'
                      }</p><img className="ddcaret" src={BlueVectorIcon} style={{ transform: Drop1 ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </DropdownToggle>
                    <DropdownMenu className='ddmenu' >
                      {connectionItems.map((fsItem, i) =>
                        <React.Fragment key={fsItem.id}>
                          <DropdownItem className='dditem' onClick={() => handleClickConnectionItem(fsItem)}>
                            {fsItem.name}
                          </DropdownItem>
                          <DropdownItem disabled className="DropDownDeviderTag" devider="true" />
                        </React.Fragment>)}
                    </DropdownMenu>
                  </Dropdown>} */}
                  {/* <Dropdown isOpen={Drop2} toggle={() => setDrop2(!Drop2)}>
                    <DropdownToggle className="dropDownButtons" outline color="secondary" onClick={() => setDrop2(!Drop2)}>
                      <p className="dropdowntext">
                        {
                          qsParams.type ?
                            actionItems.filter(item => item.value == qsParams.type)[0].name :
                            'No Action'
                        }
                      </p><img className="ddcaret" src={BlueVectorIcon} style={{ transform: Drop2 ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </DropdownToggle>
                    <DropdownMenu className='ddmenu' >
                      {actionItems.map((fsItem, i) =>
                        <React.Fragment key={fsItem.id}>
                          <DropdownItem
                            className='dditem'
                            onClick={() => {

                              handleClickActionItem(fsItem)
                            }}>
                            {fsItem.name}
                          </DropdownItem>
                          <DropdownItem devider="true" />
                        </React.Fragment>)}
                    </DropdownMenu>
                  </Dropdown> */}
{/* 
                  <AdvanceFilterTags
                    Visa={Visa}
                    setVisa={setVisa}
                    setVisaStatus={setVisaStatus}
                    setFilterCount={setFilterCount}
                    setSkillsFilterList={setSkillsFilterList}
                    setTitleFilterList={setTitleFilterList}
                    setCompanyFilterList={setCompanyFilterList}
                    setSchoolsFilterList={setSchoolsFilterList}
                    setIndustryFilterList={setIndustryFilterList}
                    skillsFilterList={skillsFilterList}
                    titleFilterList={titleFilterList}
                    schoolsFilterList={schoolsFilterList}
                    companyFilterList={companyFilterList}
                    industryFilterList={industryFilterList}


                    push={rest.history.push}
                    qsParams={qsParams}
                    skillFilterCount={qsParams.skillFilter ? true : false}
                    titleFilterCount={qsParams.titleFilter ? true : false}
                    companyFilterCount={qsParams.companyFilter ? true : false}
                    schoolFilterCount={qsParams.schoolFilter ? true : false}
                    industryFilterCount={qsParams.industryFilter ? true : false}
                    visaFilterCount={qsParams.visa ? true : false}
                    advanceFilterCount={qsParams.advanceFilterElemenate ? true : false} />

                  
                </div>
                <div className="rightFilerNavBarContainer"> */}
                  
                  {/* <Dropdown isOpen={Drop3} toggle={() => setDrop3(!Drop3)}>
                    <DropdownToggle className="dropDownButtons" outline color="primary" onClick={() => setDrop3(!Drop3)}>
                      <p className="dropdowntext">{`Sort by ${firstSort}`}</p><img className="ddcaret" src={BlueVectorIcon} style={{ transform: Drop3 ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </DropdownToggle>
                    <DropdownMenu className='ddmenu' >
                      {sortItems.map((fsItem, i) =>
                        <React.Fragment key={`fS${fsItem.id}`}>
                          <DropdownItem className='dditem' onClick={() => handleClickItemFirstSort(fsItem)}>
                            {fsItem.name}{fsItem.name === 'Title' &&
                              <p className='sortingDropDownDefaultTag'>(Default)</p>}
                          </DropdownItem>
                          <DropdownItem disabled className="DropDownDeviderTag" devider="true" />
                        </React.Fragment>

                      )}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={Drop4} toggle={() => setDrop4(!Drop4)}>
                    <DropdownToggle className="dropDownButtons" outline color="primary" onClick={() => setDrop4(!Drop4)}>
                      <p className="dropdowntext">{`Sort again by ${secondSort}`}</p><img className="ddcaret" src={BlueVectorIcon} style={{ transform: Drop4 ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </DropdownToggle>
                    <DropdownMenu className='ddmenu'>
                      {sortItems.map((scndItem, i) =>
                        <React.Fragment key={`sS${scndItem.id}`}>
                          <DropdownItem className='dditem' onClick={() => handleClickItemSecondSort(scndItem)}>
                            {scndItem.name}{scndItem.name === 'Skills' &&
                              <p className='sortingDropDownDefaultTag'>(Default)</p>}
                          </DropdownItem>
                          <DropdownItem disabled className="DropDownDeviderTag" devider="true" />
                        </React.Fragment>
                      )}
                    </DropdownMenu>
                  </Dropdown> */}
                {/* </div>
              </ div>
            </CardBody>
          </Card>

          <hr className="filterbar" />
        </Collapse>
      </ div>} */}
      <div className="filterCTAContainer" >
        <span className='minus-icon-container'>
          <Input
            type="checkbox"
            name="prospect"
            className="selectAllCheckBox"
            onChange={() => { handleClickSelectAll() }}
            // onClick={handleClickSelectAll}
            checked={SelectAllProspectsFlag} />
          {selected.length > 0 && !SelectAllProspectsFlag &&
            <div
              className='triStateCheckDiv'
              onClick={handleClickSelectAll}
            >
              <span
                onClick={handleClickSelectAll}
                className='triStateCheckSpan' />
            </div>
          }

          <Dropdown
            className='selectionPopContainer'
            isOpen={SelectionPop}
            toggle={() => setSelectionPop(!SelectionPop)
            }>
            <DropdownToggle className='selectionPop'>
              <img src={VectorIcon} alt='vector' />
            </DropdownToggle>
            <DropdownMenu className='selectionPopMenu'>
              <DropdownItem
                className='selectionPopItem'
                onClick={() => {
                  setSelectionPop(false)
                  handleClickSelectAll()
                }}
              >
                {SelectAllProspectsFlag ? 'Unselect All' : 'Select All'}
              </DropdownItem>
              <DropdownItem className='selectionPop' devider="true" />
              <DropdownItem className='selectionPopItem' text >
                <div className='topSelectionContainer'>
                  Select Top <Input
                    className="topSelection"
                    type="number"
                    name="number"
                    placeholder="100"
                    min={1}
                    max={totalProspects > 100 ? 100 : totalProspects}
                    value={topProspects}
                    onChange={(e) => { setTopProspects(e.target.value) }}
                  /> Prospects
                  </div>
                <div className='applyContainer'>
                  <Button
                    outline
                    color='primary'
                    className='selectionApply'
                    onClick={() => {
                      setSelectionPop(false)
                      handleClickSelectTop()
                    }}>
                    Apply
                    </Button>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>


        </span>
        {selected.length < 1 ?
          <React.Fragment >
            <p className='notAvailable'>Please select at least one prospect</p>
          </ React.Fragment > :
          <span className="filterCTA">
            {["Home", "Added1st", "SavedAND1stAdded", "SavedAND2ndAdded"].includes(activeTab) && (permissions === '*' || permissions.includes('CAN_REACHOUT')) &&
              <React.Fragment>
                <Button
                  id='compMsgBt'
                  className="filterIconButtons"
                  outline color="primary"
                  style={isLimitExceeded ? { opacity: 0.5 } : {}}
                  disabled={isDownloading || isArchiving || requestMeetingState.isLoading || composeMessageState.isLoading}
                  onClick={async () => {
                    if (isLimitExceeded) {
                      return
                    } else {
                      try {
                        setConnectionType(2)
                        dispatch(composeMessageLoading())

                        manualApiCall('/api/auth/user/activity/store',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ "actionName": "OPEN_COMPOSE_MESSAGE" })
                          })

                        if (SelectAllProspectsFlag) {
                          const data = await getAllProspect()
                          dispatch(selectAllProspects(data.prospectsArray.map(item => item.id)))
                        }

                        setView('ComposeMessage')
                        dispatch(composeMessageLoaded())
                      }
                      catch (e) {
                        console.log(e)
                        dispatch(composeMessageFaliure())
                      }

                    }
                  }}
                // disabled={isLimitExceeded}
                >
                  {composeMessageState.isLoading ?
                    <Loader color='blue' width='16px' height='16px' /> :
                    <img src={ComposeMessageSequence} className="filterIconSVG" />}
                </Button>
                {isLimitExceeded ?
                  <Tooltip
                    target='compMsgBt'
                    placement='bottom'
                    toggle={() => setTooltipOpenC(!tooltipOpenC)}
                    isOpen={tooltipOpenC}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    You have reached your daily Connection limit. Sending more Connection requests may result in LinkedIn blocking your account.
                  </Tooltip> :
                  <Tooltip
                    target='compMsgBt'
                    placement='bottom'
                    toggle={() => setComposeMsgToolTipOpen(!ComposeMsgToolTipOpen)}
                    isOpen={ComposeMsgToolTipOpen}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    Compose Message Sequence
                  </Tooltip>}
                <Button
                  id={'calendarMeetingRequestBtn'}
                  className="filterIconButtons"
                  outline color="primary"
                  style={isLimitExceeded ? { opacity: 0.5 } : {}}
                  disabled={isDownloading || isArchiving || requestMeetingState.isLoading || composeMessageState.isLoading}
                  onClick={async () => {
                    if (isLimitExceeded) {
                      return
                    } else {
                      try {
                        setConnectionType(2)
                        dispatch(requestMeetingLoading())
                        manualApiCall('/api/auth/user/activity/store',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ "actionName": "OPEN_REQUEST_MEETING" })
                          })

                        if (SelectAllProspectsFlag) {
                          const data = await getAllProspect()
                          dispatch(selectAllProspects(data.prospectsArray.map(item => item.id)))
                        }

                        setView('RequestMeeting')
                        console.log("LIMITISEXCEEDING!!!!!")
                        dispatch(requestMeetingLoaded())
                      }
                      catch (e) {
                        console.log(e)
                        dispatch(requestMeetingFaliure())
                      }
                    }
                  }}
                // disabled={isLimitExceeded}
                >
                  {requestMeetingState.isLoading ?
                    <Loader color='blue' width='16px' height='16px' /> :
                    <img src={RequestMeetingSequence} className="filterIconSVG" />}
                </Button>
                {isLimitExceeded ?
                  <Tooltip
                    target='calendarMeetingRequestBtn'
                    placement='bottom'
                    toggle={() => setTooltipOpenR(!tooltipOpenR)}
                    isOpen={tooltipOpenR}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    You have reached your daily Connection limit. Sending more Connection requests may result in LinkedIn blocking your account.
                </Tooltip> :
                  <Tooltip
                    target='calendarMeetingRequestBtn'
                    placement='bottom'
                    toggle={() => setRequestMeetingToolTipOpen(!RequestMeetingToolTipOpen)}
                    isOpen={RequestMeetingToolTipOpen}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    Request Meeting
                </Tooltip>}
              </React.Fragment>}
            {/* <Button className="filterbuttons" outline color="primary"
              onClick={() => setView('RequestMessage')}>
                Request Meeting
            </Button> */}
            {/* <CSVLink
              asyncOnClick={true}
              onClick={ (event, done) => {
                 handleDownloadCSV()
                 .then(() => {
                   return simulateTimeout(300)
                 })
                 .then(r => {
                   done()
                 })
                 .catch(e => {
                   console.log('error MESSAGE: ', e.message)
                 })
                
              }}
              // data={csvDownloadData}
              data={ csvDownloadData }
              filename={fileName}>
              <Button
                className="downloadButtonCSV filterbuttons"
                outline
                color="primary">
                Download CSV
              </Button>
            </CSVLink> */}
            <CsvExport asyncExportMethod={handleDownloadCSV}>
              <Button
                id="DownloadCSVButton"
                className="filterIconButtons"
                disabled={isDownloading || isArchiving || isUnarchiving || requestMeetingState.isLoading || composeMessageState.isLoading}
                outline
                color="primary">
                {(isDownloading) ?
                  <Loader color='blue' width='16px' height='16px' /> :
                  <img src={DownloadCSV} className="filterIconSVG" />}
              </Button>
            </CsvExport>
            <Tooltip
              target='DownloadCSVButton'
              placement='bottom'
              toggle={() => setDownloadCSVToolTipOpen(!DownloadCSVToolTipOpen)}
              isOpen={DownloadCSVToolTipOpen}
              // fade={true}
              style={{ zIndex: 9 }}
              className='tooltip-root'>
              Download as CSV
            </Tooltip>
            {/* <Button
              id="UsaveButton"
              outline color='secondary'
              className='trashIconContainer'
              onClick={handleClickArchive}>
              <img className='trashIcon' src={TrashIcon} alt='trash' />
            </Button>
            <Tooltip
              target='UsaveButton'
              placement='bottom'
              toggle={() => setUnsaveToolTipOpen(!UnsaveToolTipOpen)}
              isOpen={UnsaveToolTipOpen}
              style={{ zIndex: 9 }}
              className='tooltip-root'>
              Unsave Selected Prospects
            </Tooltip> */}

            {["Home", "Added1st", "SavedAND1stAdded", "SavedAND2ndAdded"].includes(activeTab) &&
              <React.Fragment>
                <Button
                  id="ArchiveButton"
                  outline color='secondary'
                  className='trashIconContainer'
                  disabled={isDownloading || isArchiving || requestMeetingState.isLoading || composeMessageState.isLoading}
                  onClick={handleClickArchive}>
                  {(isArchiving) ? <Loader color='#297AF7' width='16px' height='16px' /> : <img className='trashIcon' src={TrashIcon} alt='trash' />}

                </Button>
                <Tooltip
                  target='ArchiveButton'
                  placement='bottom'
                  toggle={() => setArchiveToolTipOpen(!archiveToolTipOpen)}
                  isOpen={archiveToolTipOpen}
                  className='tooltip-root'>
                  Archive
              </Tooltip>
              </React.Fragment>
            }

            {activeTab === 'Archived' &&
              <React.Fragment>
                <Button
                  id="UnarchiveButton"
                  outline
                  color='primary'
                  className='filterIconButtons'
                  disabled={isDownloading || isUnarchiving}
                  onMouseOver={() => setUnarchiveToolTipOpen(true)}
                  onMouseOut={() => setUnarchiveToolTipOpen(false)}
                  onClick={handleClickUnarchive}>
                  {(isUnarchiving)? 
                    <Loader color='#297AF7' width = '16px' height = '16px' /> : 
                    <img src={UnarchiveProspectBlue} />}
                </Button>
                <Tooltip
                    target='UnarchiveButton'
                    placement='bottom'
                    // toggle={() => setUnarchiveToolTipOpen(true)}
                    isOpen={unarchiveToolTipOpen}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    Unarchive
                </Tooltip>
              </ React.Fragment>}

          </ span>}
          <span className="filterAndSortContainer">

          {/* <Button
            color="primary"
            className="advancedFilterButton"
            onClick={handleScoringFilterOpen}>
              Scoring Filters
          </ Button> */}
          <Dropdown isOpen={Drop2} toggle={() => setDrop2(!Drop2)}>
            <DropdownToggle className="dropDownButtons" outline color="primary" onClick={() => setDrop2(!Drop2)}>
             
                {`${secondaryFilter} `}
                <svg style={{ transform: Drop2 ? "rotate(180deg)" : "rotate(0deg)" }} width="8" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </DropdownToggle>
            <DropdownMenu className='ddmenu' >
              {["Downloaded"].includes(activeTab)?
                filterItems.filter(itm => itm.name !== 'Downloaded').map((fsItem, i) =>
                  <React.Fragment key={`sF${fsItem.id}`}>
                    <DropdownItem className='dditem' onClick={() => handleClickItemSecondaryFilter(fsItem)}>
                      {fsItem.name}{fsItem.name === 'All Prospects' &&
                        <p className='sortingDropDownDefaultTag'>(Default)</p>}
                    </DropdownItem>
                    {/* <DropdownItem disabled className="DropDownDeviderTag" devider="true" /> */}
                  </React.Fragment>) :
                filterItems.map((fsItem, i) =>
                  <React.Fragment key={`sF${fsItem.id}`}>
                    <DropdownItem className='dditem' onClick={() => handleClickItemSecondaryFilter(fsItem)}>
                      {fsItem.name}{fsItem.name === 'All Prospects' &&
                        <p className='sortingDropDownDefaultTag'>(Default)</p>}
                    </DropdownItem>
                    {/* <DropdownItem disabled className="DropDownDeviderTag" devider="true" /> */}
                  </React.Fragment>

              )}
            </DropdownMenu>
            </Dropdown>
            {!['MeetingConfirmed', 'Other'].includes(activeTab) &&
              <Dropdown isOpen={Drop1} toggle={() => setDrop1(!Drop1)}>
                <DropdownToggle className="dropDownButtons" outline color="primary" onClick={() => setDrop1(!Drop1)}>
                  
                    {`${timeFilter} `}
                    <svg style={{ transform: Drop1 ? "rotate(180deg)" : "rotate(0deg)" }} width="8" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </DropdownToggle>
                <DropdownMenu className='ddmenu' >
                  {timeFilterItems.map((fsItem, i) =>
                    <React.Fragment key={`sTF${fsItem.id}`}>
                      <DropdownItem className='dditem' onClick={() => handleClickItemTimeFilter(fsItem)}>
                        {fsItem.name}{fsItem.name === 'All Time' &&
                          <p className='sortingDropDownDefaultTag'>(Default)</p>}
                      </DropdownItem>
                      <DropdownItem disabled className="DropDownDeviderTag" devider="true" />
                    </React.Fragment>

                  )}
                </DropdownMenu>
            </Dropdown>}
            <span
              // style={{ 
              //   borderRightColor: filterCount > 0 ? "#E6E9ED" : "transparent",
              //   borderLeftColor: filterCount > 0 ? "#E6E9ED" : "transparent"}} 
              className="filterCountContainer">

              <Button
                color="primary"
                className="advancedFilterButton"
                onClick={handleAdvancedFilterOpen}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6673 2H1.33398L6.66732 8.30667V12.6667L9.33398 14V8.30667L14.6673 2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {"Filters"}
              </ Button>
              
              {filterCount > 0 &&
                <a
                  className="clearFilters"
                  onClick={handleClearFilters}>
                  Clear ({filterCount})
                </ a>}
            </span>

            <Button
              color="primary"
              className="advancedFilterButton"
              onClick={handleSortOpen}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33268 8H2.66602" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.3327 4H2.66602" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.33268 12H2.66602" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
                {`Sort by ${firstSort.name} `} 
                {!['Male', 'Female'].includes(firstSort.name) &&
                  <svg style={{margin: '0px', transform: firstSort.sort==='asc' ? 'rotate(180deg)': 'rotate(0deg)'}} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7L3 9L5 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 9L3 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>}
                {` and ${secondSort.name}`}
                {!['Male', 'Female'].includes(secondSort.name) &&
                  <svg style={{margin: '0px 0px 0px 4px ', transform: secondSort.sort==='asc' ? 'rotate(180deg)': 'rotate(0deg)'}} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7L3 9L5 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 9L3 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>}
            </ Button>
          </span>
        {/* {!Show && 
          <Button
            style={{ margin: 'auto 32px auto auto' }}
            className="filterbuttons"
            outline
            color="primary"
            onClick={() => setIcon(!Icon)}>
            {`Filter/Sort ${Icon ? '-' : '+'}`}
          </Button>} */}
       
      </ div> 
      {selected.length > 0 && <div className='selectionCounterTagBold'>
        {`${SelectAllProspectsFlag ?
          totalRecord :
          selected.length}`}
        <p className='selectionCounterTag'>
          {` of ${totalRecord} prospects selected`}
        </p>
      </div>}
    </ React.Fragment>
  )
}

export default withRouter(
  connect(state => {
    return {
      AdvFilters: state.score.advancedFilters,
      ScoringFilters: state.score.scoringFilters,
      allProspects: state.score.allProspects,
      composeMessageState: state.score.composeMessage,
      requestMeetingState: state.score.requestMeeting
    }
  })(FilterSection))
