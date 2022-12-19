import React, { useState, useEffect, useRef } from "react";
import { Container, Card, Button, Tooltip, Collapse } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Waypoint } from 'react-waypoint'
import qs from 'query-string'

import { manualApiCall } from '../../utils'
import Header from "../../components/Header"
import JdSteps from "../../components/JdSteps"
import Loader from "../../components/Loader"
import '../JobDescription/JobDescription.css'
import './style.css'
import usePrevious from '../../customHooks/usePrevious'

import {
  fetchProspects,
  unselectAllProspects,
  setConnectLimit,
  initializeConnectSent,
  fetchAdvancedFilter,
  fetchPencilitAccount,
  clearAdvancedFilters,
  setActiveTab
} from '../../actions/score'
import {
  loadPreEvalForm
} from '../../actions/preEvaluationForm'

import FilterSection from './FilterSection'
import AdvanceFilterSection from './AdvanceFilterSection'
import ListSection from './ListSection'
// import { JobLabel } from './JobLabel'

import ComposeMessage from './views/ComposeMessage'
import RequestMeeting from './views/RequestMeeting'
import BlankSlate from "../../components/BlankSlate";
import TabsSection from "./TabsSection";

import MainTabsIcon from '../../../../img/greyCloseMenu.svg'
import HoverTabsIcon from '../../../../img/blueCloseMenu.svg'
import SortSection from "./SortSection";
// import usePrevious from '../../customHooks/usePrevious'

const dailyLimitSelectOptions = [{
  id: 1,
  value: 100
}, {
  id: 2,
  value: 250
}, {
  id: 3,
  value: 500
}, {
  id: 4,
  value: 5
}]

const ScoreAndConnect = (props) => {

  const [pencilitAccount, setpencilitAccount] = useState(false)
  const [VisaStatus, setVisaStatus] = useState(2)
  const [schoolsFilterList, setSchoolsFilterList] = useState([])
  const [companyFilterList, setCompanyFilterList] = useState([])
  const [skillsFilterList, setSkillsFilterList] = useState([])
  const [industryFilterList, setIndustryFilterList] = useState([])
  const [titleFilterList, setTitleFilterList] = useState([])
  // const [activeTab, setActiveTab] = useState('tF' in qs.parse(search) ?  qs.parse(search).tF : 'Home');
  const [connectionType, setConnectionType] = useState(2)
  const [FirstSort, setFirstSort] = useState({ sort: 'title_score', order: 'desc' });
  const [SecondSort, setSecondSort] = useState({ sort: 'skill_score', order: 'desc' });
  const [Visa, setVisa] = useState([{
    id: 'H1b',
    value: false
  },
  {
    id: 'Green Card',
    value: false
  },
  {
    id: 'Citizen',
    value: false
  },
  {
    id: 'OPT',
    value: false
  }])

  const [messageLimitTooltip, setMessageLimitTooltip] = useState(false)

  const [Show, setShow] = useState(false)
  const [ScoringFilterShow, setScoringFilterShow] = useState(false)
  const [SortShow, setSortShow] = useState(false)
  const [moreDetailsPopUp, setMoreDetailsPopUp] = useState(false)

  // const [viewState, setView] = useState('ScoreAndConnect')
  const [preSelected, setPreSelected] = useState(false)

  const [SelectAllProspectsFlag, setSelectAllProspectsFlag] = useState(false)

  const [refState, setRefState] = useState(false)
  const [RenderStepperState, setRenderStepperState] = useState(false)

  const [newJob, setNewJob] = useState(false)

  const [MainTabs, setMainTabs] = useState(true)
  const MainTabsRef = useRef(null)

  let {
    user,
    score: {
      isLoading,
      isDataAvailable,
      isLoadingMore,
      isBlocked,
      permissions,
      data,
      shouldFetchAgain,
      loadingActivities,
      activeTab
    },
    dispatch,
    location: {
      search
    },
    history: {
      push
    },
    selected,
    archive,
    unarchive,
    downloadedState,
    save,
    unsave,
    composeMessageState,
    requestMeetingState,
    enhancing,
    dailyLimit,
    advancedFilterData,
    fetchPencilitAccountDetail,
    preEvaluationForm,
    setView,
    viewState

  } = props

  const isEnhancingPrev = usePrevious(enhancing.isEnhancing)
  const isArchivingPrev = usePrevious(archive.isArchiving)
  const isUnarchivingPrev = usePrevious(unarchive.isUnarchiving)
  const isSavingPrev = usePrevious(save.isSaving)
  const isUnsavingPrev = usePrevious(unsave.isUnsaving)


  const visaCount = qs.parse(search).visa ? qs.parse(search).visa.split('||').length : 0
  const industryCount = qs.parse(search).industryFilter ? qs.parse(search).industryFilter.split('||').length : 0
  const skillCount = qs.parse(search).skillFilter ? qs.parse(search).skillFilter.split('||').length : 0
  const companyCount = qs.parse(search).companyFilter ? qs.parse(search).companyFilter.split('||').length : 0
  const schoolCount = qs.parse(search).schoolFilter ? qs.parse(search).schoolFilter.split('||').length : 0
  const titleCount = qs.parse(search).titleFilter ? qs.parse(search).titleFilter.split('||').length : 0
  const calendarIntegrationRedirection = qs.parse(search).calendarIntegrated ? qs.parse(search).calendarIntegrated : null


  // console.log('CALENDAR INTEGRATION REDIRECTION: ', calendarIntegrationRedirection)

  const [FilterCount, setFilterCount] = useState(visaCount +
    industryCount +
    skillCount +
    companyCount +
    schoolCount +
    titleCount)

  const [ScoringFilterCount, setScoringFilterCount] = useState(0)

  const {
    data: {
      skills,
      industries,
      companies,
      schools,
      titles,
      locations,
      educations
    }
  } = advancedFilterData

  chrome.storage.local.get('jobArray', (result) => {
    const [jobData] = result.jobArray.filter(jobs => jobs.jobID == qs.parse(search).jId)
    if (jobData?.meta?.isNew)
      setNewJob(true)
  })
  const connectionMessage = type => {
    setConnectionType(type)
  }

  useEffect(() => {
    if (!preEvaluationForm.isLoading && !preEvaluationForm.isDataAvailable)
      dispatch(loadPreEvalForm(qs.parse(search).jId))
    if (!advancedFilterData.isDataAvailable && !advancedFilterData.isLoading) {

      dispatch(fetchAdvancedFilter(qs.parse(search)))
    }
    const todaysDate = new Date()
    const todaysConnects = `${todaysDate.getDate()}-${todaysDate.getMonth()}-${todaysDate.getFullYear()}-connects`
    chrome.storage.local.get(['ConnectDailyLimitSelected', todaysConnects], function (r) {
      if (r['ConnectDailyLimitSelected']) {
        dispatch(setConnectLimit(r['ConnectDailyLimitSelected']))
      } else {
        dispatch(setConnectLimit(100))
      }

      if (r[todaysConnects]) {
        dispatch(initializeConnectSent(r[todaysConnects]))
      } else {
        dispatch(initializeConnectSent(0))
      }
    })
    chrome.storage.local.get('jobArray', function (result) {
      if (result['jobArray'].length === 1)
        setRenderStepperState(true)
    })
    if ('tF' in qs.parse(search))
      dispatch(setActiveTab(qs.parse(search).tF))
  }, [])

  useEffect(() => {
    if ((isEnhancingPrev && !enhancing.isEnhancing)
      // ||
      // (isArchivingPrev && !archive.isArchiving) ||
      // (isUnarchivingPrev && !unarchive.isUnarchiving) ||
      // (isSavingPrev && !save.isSaving) ||
      // (isUnsavingPrev && !unsave.isUnsaving)) 
    ) {
      // console.log('DATA.PAGE NUMBER: ', data.pageNo)
      getProspects(data.pageNo)
    }
  }, [enhancing.isEnhancing, save.isSaving, unsave.isUnsaving])

  useEffect(() => {
    if (shouldFetchAgain) {
      getProspects(data.pageNo)
    }
  }, [shouldFetchAgain])

  useEffect(() => {
    if (!isLoading && isDataAvailable && refState) {

      const id = refState;
      const yOffset = -110;
      const element = document.getElementById(id);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
      // document.getElementById(refState).scrollIntoView({ behavior: "smooth", block: "end" })
      setRefState(false)

    }
  }, [isDataAvailable, isLoading])

  useEffect(() => {
    if (!isLoading) {
      getProspects()
    }
  }, [search])

  const getProspects = (pageUptil = null) => {
    const params = qs.parse(search)

    if (pageUptil) {
      params['pU'] = pageUptil
    }

    // console.log('PARAMS ARE --------- ', params)

    dispatch(fetchProspects(params, pageUptil ? null : 1))

  }

  useEffect(() => {

    if (user && user.name) {
      dispatch(fetchPencilitAccount(user))
      // alert(JSON.stringify(fetchPencilitAccountDetail))
      if (fetchPencilitAccountDetail.isSuccess) {
        // alert('sdfsdf')
      }
      if (calendarIntegrationRedirection !== null) {
        dispatch(fetchPencilitAccount(user))
      }
      if (calendarIntegrationRedirection !== null) {
        isLoading = true
      }
    }
    // alert(user)
  }, [user])

  const handleWaypointOnEnter = () => {
    const searchParams = qs.parse(search)
    const {
      pageNo
    } = data

    // console.log("=====================waypoint", pageNo)

    dispatch(fetchProspects(searchParams, (parseInt(pageNo, 10) + 1)))
  }

  const handleChangeDailyLimit = (e) => {
    const newVal = e.target.value
    chrome.storage.local.set({
      'ConnectDailyLimitSelected': `${e.target.value}`
    }, function () {
      dispatch(setConnectLimit(newVal))
    })
  }
  if (fetchPencilitAccountDetail.isSuccess) {
    // alert(JSON.stringify(fetchPencilitAccountDetail))
  }
  const heading = user && user.name ? `Welcome, ${user.name}` : `Welcome back`
  // if (user.isDataAvailable && !(pencilitAccount)) dispatch(fetchPencilitAccount(user))
  const shouldRenderWaypoint = isDataAvailable ?
    data.prospectsArray.length > 0 && parseInt(data.pageNo, 10) !== Math.ceil(parseInt(data.counts.currentCount) / parseInt(data.prospectsPerPage)) : false

  useEffect(() => {

    if (isDataAvailable && calendarIntegrationRedirection !== null) {
      // alert('Hello got')
      console.log('DEBUG [1]')

      chrome.storage.local.get('calendarIntegrated', (r) => {
        if (!r?.calendarIntegrated) {
          console.log('DEBUG [2]')
          selected.push(...qs.parse(location.search).selectedProspects.split('-').map(str => Number(str)))
          // console.log('CAALING SET VIEW REQU')
          setView('RequestMeeting')
          isLoading = false

          // chrome.storage.local.set({ 'calendarIntegrated': true })
        }
      })
    }
    // alert(user)
  }, [isDataAvailable])

  useEffect(() => {
    const searchParams = qs.parse(search)
    const newParams = {
      jId: searchParams.jId,
      isConnectPage: 1,
      fS: 'title_score',
      fSO: 'desc',
      secS: 'skill_score',
      secSO: 'desc'
    }

    if (searchParams.tF)
      newParams['tF'] = searchParams.tF
    if (searchParams.tN)
      newParams['tN'] = searchParams.tN
    if (searchParams.calendarIntegrated)
      newParams['calendarIntegrated'] = searchParams.calendarIntegrated
    if (searchParams.selectedProspects)
      newParams['selectedProspects'] = searchParams.selectedProspects

    dispatch(clearAdvancedFilters())
    push(`/html/job.html?${qs.stringify(newParams)}`)
  }, [activeTab])

  const handleMainTabsToggle = (e) => {
    setMainTabs(prev => !prev)
  }


  return (
    <div style={isBlocked ? { height: '100vh', overflow: 'hidden' } : {}}>
      {isBlocked &&
        <>
          <Card className='BlockPopUp'>
            <div className='helpingTextContainer'>
              <img src='../../../img/info.svg' />
              <p className='helpingText'>Free usage limit reached. Please contact support at admin@dnnae.com</p>
            </div>
            <div className='contactSupportContainer'>
              <a href='mailto:admin@dnnae.com'>
                <Button
                  color='primary'
                  outline
                  // onClick={() => }
                  className='contactSupportButton'>
                  Contact Support
              </Button>
              </a>
            </div>
          </Card>
          <div className='CoverBlocked'>
          </div>
        </>}

      {/* <Header {...props.user} /> */}
      {
        // (RenderStepperState && data.prospectsArray) ?
        //   <div className='headerContainer'>
        //     <div className="mainTitleHeadingContainer">
        //       <h1 className="heading">{heading}</h1>
        //       <p className="subheading">Let's get back to your prospect search.</p>
        //     </ div>
        //     {/* <h1 className="newFlowHeading">
        //       {data?.jobData?.jobTitle}
        //     </h1> */}
        //     <JdSteps onStep={4} />
        //     <hr className='bottomBorder' />
        //   </div> :
        //   <div className="newFlowHeaderContainer" >
        //     <h1 className="newFlowHeading">
        //       {data?.jobData?.jobTitle}
        //     </h1>
        //     <div>
        //       <JobLabel
        //         job={data?.jobData}
        //         dispatch={dispatch}
        //       />
        //     </div>
        //   </div>
      }
      {isBlocked ?
        <div className='blockedContainer'>
          <img className="blockedScreen" src='../../../img/BlockScreen.png' />
        </div> :
        <div className="main-sac-body-container">
          {!(viewState === 'ComposeMessage' || viewState === 'RequestMeeting') &&
            <Container
              className="leftNavContainer"
              style={{ width: MainTabs ? "20%" : "50px" }}>
              <div className="leftNavSection">
                <img
                  ref={MainTabsRef}
                  className='mainTabsIcon'
                  onClick={handleMainTabsToggle}
                  onMouseEnter={() => MainTabsRef.current.src = HoverTabsIcon}
                  onMouseOut={() => MainTabsRef.current.src = MainTabsIcon}
                  src={MainTabsIcon}
                  alt="drop down"
                  style={{ transform: MainTabs ? "rotate(0deg)" : "rotate(180deg)" }} />
                <div className="leftNavHeaderContainer">
                  {MainTabs &&
                    <h3
                      className="leftNavHeader">
                      {`Prospects (${data?.counts?.totalProspects ?? 0})`}
                    </h3>}
                </div>
                <Collapse
                  isOpen={MainTabs}
                  className="leftNavBodyContainer">
                  <TabsSection
                    setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                    counts={data?.counts}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    viewState={viewState}
                    newJob={newJob}
                    search={search}
                    push={push}
                    dispatch={dispatch}
                    unselectAllProspects={unselectAllProspects} />
                </Collapse>
              </div>
            </Container>
          }
          <Container className='sac-container'>
            <div className='sac-content'>
              <div className='sacMainContainer'>
                {/* {(activeTab === 'Home' || qs.parse(search).tF === "SavedANDNotMessaged") ?
                <div className="sectionHeading">
                  <h2 style={{ margin: "0px" }}>Message Prospects</h2>

                  <span style={{ height: '20px' }} className='verBar' />
                  <div className="dailyLimitConatiner" style={{ display: 'flex' }}>
                    <span>Daily Limit</span>
                    <select
                      value={dailyLimit.limit}
                      onChange={handleChangeDailyLimit}
                      className='limit-selector'
                    >
                      {dailyLimitSelectOptions.map(item =>
                        <option key={item.id}>{item.value}</option>
                      )}
                    </select>
                    <p>requests</p>
                    <div
                      className='info-icon'
                      id='messageLimitsTooltip'
                      style={{
                        backgroundColor: '#CDD1D7',
                        marginLeft: '10px'
                      }}
                    />
                    <Tooltip
                      placement="bottom"
                      isOpen={messageLimitTooltip}
                      target="messageLimitsTooltip"
                      toggle={() => setMessageLimitTooltip(!messageLimitTooltip)}
                      fade={true}
                    >
                      Selecting a limit too high may result in LinkedIn blocking your account.
                  </Tooltip>
                  </div>
                </div> :
                <div className="sectionHeading">
                </div>} */}
                {viewState === 'ComposeMessage' &&
                  <ComposeMessage
                    setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                    userName={props.user.name}
                    viewState={viewState}
                    connectionType={connectionType}
                    connectMessage={connectionMessage}
                    setView={(view) => {
                      dispatch(unselectAllProspects())
                      setView(view)
                      getProspects()
                    }}
                    selected={selected}
                    data={data.prospectsArray}
                    jobData={data.jobData}
                    SelectAllProspectsFlag={SelectAllProspectsFlag}
                  />
                }

                {viewState === 'ScoreAndConnect' &&
                  <React.Fragment>
                    <div
                      className="sectionFilter"
                      id="filters"
                      style={{
                        position: moreDetailsPopUp ? 'relative' : 'sticky',
                        paddingBottom: selected.length > 0 ? '12px' : '24px'
                      }}>
                      {(!advancedFilterData.isLoading && advancedFilterData.isDataAvailable) &&

                        <AdvanceFilterSection
                          FilterCount={FilterCount}
                          setFilterCount={setFilterCount}
                          setSchoolsFilterList={setSchoolsFilterList}
                          schoolsFilterList={schoolsFilterList}
                          setVisaStatus={setVisaStatus}
                          VisaStatus={VisaStatus}
                          setCompanyFilterList={setCompanyFilterList}
                          companyFilterList={companyFilterList}
                          setSkillsFilterList={setSkillsFilterList}
                          skillsFilterList={skillsFilterList}
                          setIndustryFilterList={setIndustryFilterList}
                          industryFilterList={industryFilterList}
                          setTitleFilterList={setTitleFilterList}
                          titleFilterList={titleFilterList}
                          setVisa={setVisa}
                          Visa={Visa}

                          setSelectAllProspectsFlag={setSelectAllProspectsFlag}

                          search={search}
                          push={push}
                          Show={Show}
                          setShow={setShow}

                          locations={locations}
                          educations={educations}
                          skills={skills}
                          industries={industries}
                          companies={companies}
                          schools={schools}
                          titles={titles}
                          isDataAvailable={advancedFilterData.isDataAvailable}
                          activeTab={activeTab}



                          titleFlag={data?.prospectsArray[0]?.scoring?.title_total > 0 || data?.counts?.currentCount < 1}
                          skillFlag={data?.prospectsArray[0]?.scoring?.skill_total > 0 || data?.counts?.currentCount < 1}
                          industryFlag={data?.prospectsArray[0]?.scoring?.industry_total > 0 || data?.counts?.currentCount < 1}
                          experienceFlag={data?.prospectsArray[0]?.scoring?.experience_total > 0 || data?.counts?.currentCount < 1}
                          educationFlag={data?.prospectsArray[0]?.scoring?.education_total > 0 || data?.counts?.currentCount < 1}

                        />
                      }
                      <SortSection

                        Show={SortShow}
                        setShow={setSortShow}

                        FirstSort={FirstSort}
                        setFirstSort={setFirstSort}
                        SecondSort={SecondSort}
                        setSecondSort={setSecondSort}
                        unselectAllProspects={unselectAllProspects}
                        search={search}
                        push={push}
                        activeTab={activeTab}
                      />
                      <FilterSection
                        permissions={permissions}
                        FilterCount={FilterCount}
                        setFilterCount={setFilterCount}
                        ScoringFilterCount={ScoringFilterCount}
                        setScoringFilterCount={setScoringFilterCount}

                        FirstSort={FirstSort}
                        setFirstSort={setFirstSort}
                        SecondSort={SecondSort}
                        setSecondSort={setSecondSort}

                        setSchoolsFilterList={setSchoolsFilterList}
                        schoolsFilterList={schoolsFilterList}
                        setVisaStatus={setVisaStatus}
                        VisaStatus={VisaStatus}
                        setCompanyFilterList={setCompanyFilterList}
                        companyFilterList={companyFilterList}
                        setSkillsFilterList={setSkillsFilterList}
                        skillsFilterList={skillsFilterList}
                        setIndustryFilterList={setIndustryFilterList}
                        industryFilterList={industryFilterList}
                        setTitleFilterList={setTitleFilterList}
                        titleFilterList={titleFilterList}
                        setVisa={setVisa}
                        Visa={Visa}

                        activeTab={activeTab}
                        isArchiving={archive.isArchiving}
                        isUnarchiving={unarchive.isUnarchiving}
                        isDownloading={downloadedState.isDownloading}
                        newJob={newJob}


                        setView={setView}
                        Show={Show}
                        setShow={setShow}
                        ScoringFilterShow={ScoringFilterShow}
                        setScoringFilterShow={setScoringFilterShow}
                        SortShow={SortShow}
                        setSortShow={setSortShow}

                        selected={selected}
                        dispatch={dispatch}
                        totalProspects={data.prospectsArray.length}
                        totalRecord={data?.counts?.currentCount}
                        csvData={data.prospectsArray}
                        jobTitle={data?.jobData?.jobTitle}
                        jobId={data?.jobData?.jobId}
                        SelectAllProspectsFlag={SelectAllProspectsFlag}
                        setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                        isLimitExceeded={parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)}

                        setConnectionType={setConnectionType}
                      />

                    </ div>
                    {(!isLoading && !isBlocked && isDataAvailable) &&
                      <React.Fragment>
                        <ListSection
                          composeMessageState={composeMessageState}
                          requestMeetingState={requestMeetingState}
                          isArchiving={archive.isArchiving}
                          isUnarchiving={unarchive.isUnarchiving}
                          isDownloading={downloadedState.isDownloading}
                          thisUser={{ ...props.user }}
                          userName={data?.jobData?.userName}
                          ownerName={props.user.name}
                          activeTab={activeTab}
                          refState={refState}
                          setRefState={setRefState}
                          totalRecord={data?.counts?.currentCount}
                          SelectAllProspectsFlag={SelectAllProspectsFlag}
                          setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                          moreDetailsPopUp={moreDetailsPopUp}
                          setMoreDetailsPopUp={setMoreDetailsPopUp}
                          data={data?.prospectsArray}
                          selected={selected}
                          isDataAvailable={isDataAvailable}
                          dispatch={dispatch}
                          enhancing={enhancing}
                          jobId={data.jobID}
                          loadingActivities={loadingActivities}
                        />
                        {shouldRenderWaypoint &&
                          <Waypoint
                            fireOnRapidScroll={true}
                            onEnter={handleWaypointOnEnter}
                          />
                        }
                        {isLoadingMore && <Container className="loader">
                          <Loader color='#297AF7' height='50px' width='50px' />
                        </Container>}
                      </React.Fragment>
                    }
                  </ React.Fragment>
                }
                {(!isLoading && !isBlocked && data.prospectsArray.length < 1) &&
                  <BlankSlate setSelectAllProspectsFlag={setSelectAllProspectsFlag} />}
              </ div>
              {isLoading && <Container className="loader"><Loader color='#297AF7' height='50px' width='50px' /></Container>}
              {calendarIntegrationRedirection !== null && !fetchPencilitAccountDetail.isSuccess && <Container className="loader"><Loader color='#297AF7' height='50px' width='50px' /></Container>}

              {viewState === 'RequestMeeting' && fetchPencilitAccountDetail.isSuccess &&
                <RequestMeeting
                  viewState={viewState}
                  connectionType={connectionType}
                  connectMessage={connectionMessage}
                  setView={(view) => {
                    dispatch(unselectAllProspects())
                    setView(view)
                    const searchParams = qs.parse(search)
                    const newParams = {
                      jId: searchParams.jId,
                      fS: searchParams.fS,
                      fSO: searchParams.fSO,
                      secS: searchParams.secS,
                      secSO: searchParams.secSO,
                      tN: searchParams.tN
                    }
                    if (searchParams.tF)
                      newParams['tF'] = searchParams.tF
                    if (qs.stringify(searchParams) === qs.stringify(newParams)) {
                      getProspects()
                    }

                    else
                      push(`/html/job.html?${qs.stringify(newParams)}`)
                  }}
                  selected={selected}
                  fetchPencilitAccountDetail={fetchPencilitAccountDetail}
                  dailyLimit={dailyLimit}
                  data={data?.prospectsArray}
                  jobData={data.jobData}
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag} />
              }
              {/*<RequestMeeting viewState={viewState} setView={setView} selected={selected} />*/}

              {/* <RequestMeeting viewState={viewState} setView={setView} selected={selected} /> */}

            </div>
          </Container >
        </div>}
    </div >
  )
}


export default
  withRouter(connect(state => {
    return {
      downloadedState: state.score.downloaded,
      user: state.auth.user,
      score: state.score.list,
      preEvaluationForm: state.score.preEvaluationForm,
      selected: state.score.selected,
      archive: state.score.archive,
      unarchive: state.score.unarchive,
      save: state.score.save,
      unsave: state.score.unsave,
      composeMessageState: state.score.composeMessage,
      requestMeetingState: state.score.requestMeeting,
      enhancing: state.score.enhancing,
      dailyLimit: state.score.dailyLimit,
      advancedFilterData: state.score.advancedFilterData,
      fetchPencilitAccountDetail: state.score.fetchPencilitAccountDetail
    }
  })(ScoreAndConnect));