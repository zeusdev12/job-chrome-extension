import React, {useState, useEffect} from 'react'
import {Collapse, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'

import qs from 'query-string'
import { withRouter } from 'react-router-dom'

import { manualApiCall } from '../../utils'
import {
  unselectAllProspects
} from '../../actions/score'


import DropDownIcon from '../../../../img/vector.svg'


const TabsCollapseContainer = ({
  handleOnClick,
  tabState,
  tabName,
  tabCount,
  indentLevel
  }) => (
    <a
      onClick={handleOnClick}
      className="leftNavBodyItem">
      <div className="leftNavBodyMainTitleContainer">
        <img
          className='seeMoreCaret'
          src={DropDownIcon}
          alt="drop down"
          style={{ transform: tabState ? "rotate(180deg)" : "rotate(0deg)" }} />
        <h3 className={`leftNavBodyMainTitle${indentLevel}`}>
          {`${tabName}`}
        </h3>
      </div>
      <div className="navBodyCounterContainer">
        <h3 className="navBodyCounter">
          {`${tabCount}`}
        </h3>
      </div>
    </a>)

const TabMainModule = ({
  setSelectAllProspectsFlag,
  tabStateCondition,
  tabState,
  tabName,
  tabCount,
  actionName,
  indentLevel,
  viewState,
  activeTab,
  setActiveTab,
  push,
  search,
  dispatch,
  unselectAllProspects
}) => {

  const handleOnClick = () => {
    if (viewState === 'ComposeMessage' ||
      viewState === 'RequestMeeting')
      return false
    if (tabStateCondition) {
      window.scrollTo({top: 0, behavior: 'smooth'});
      
      dispatch(setActiveTab(tabState))
      setSelectAllProspectsFlag(false)

      const parameters = qs.parse(search)
      if(tabState==='Home')
        delete parameters.tF
      else
        parameters['tF'] = tabState

      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            "actionName": actionName,
          "jobId" :parameters.jId})
        })

      const qsStr = qs.stringify(parameters)
      dispatch(unselectAllProspects())
      push(`/html/job.html?${qsStr}`)
    }

  }


  return(
    <a
      className={`${activeTab === tabState ?
        "navItemActive " : ""}${viewState === 'ComposeMessage' ||
          viewState === 'RequestMeeting' ?
          "stopCursor " : ""}leftNavBodyItem`}
      onClick={handleOnClick} >
      <div className="leftNavBodyMainTitleContainer">
        <span className="caretSpaceholder" />
        <h3 className={activeTab === tabState ?
          `navTitleActive leftNavBodyMainTitle${indentLevel}` :
          `leftNavBodyMainTitle${indentLevel}`}>
          {tabName}
        </h3>
      </div>
      <div className="navBodyCounterContainer">
        <h3 className={activeTab === tabState ?
          "navCounterActive navBodyCounter" :
          "navBodyCounter"}>
          {`${tabCount}`}
        </h3>
      </div>
    </a>)
}

const TabsSection = ({ 
  setSelectAllProspectsFlag,
  counts ,
  activeTab ,
  setActiveTab,
  viewState,
  newJob,
  search,
  push,
  dispatch,
  unselectAllProspects
  }) => {



  const [MainAddedTabs, setMainAddedTabs] = useState(true)
  const [MainMessagededTabs, setMainMessagedTabs] = useState(true)

  const [SavedTabs, setSavedTabs] = useState(false)
  const [SavedAddedTabs, setSavedAddedTabs] = useState(true)
  const [SavedMessagedTabs, setSavedMessagedTabs] = useState(true)
   
  return (
    <React.Fragment> 
      <div className="leftNavBodyMain" >
        <ul>
          {/* <li>
            <TabsCollapseContainer 
              handleOnClick={() => setMainAddedTabs(prev => !prev)}
              tabState={MainAddedTabs}
              tabName={'Added'}
              tabCount={counts?.totalAddedProspects ?? 0}
              indentLevel={""}
            />
          </li>
          <Collapse
            isOpen={MainAddedTabs}> */}
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'tF' in qs.parse(search)}
                tabState={"Home"}
                tabName={"Added"}
                tabCount={counts?.totalAdded2nd ?? 0}
                actionName={"2ND_ADDED_FILTER"}
                indentLevel={""}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
            {/* <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={qs.parse(search)?.tF !== "Added1st"}
                tabState={"Added1st"}
                tabName={"1st"}
                tabCount={counts?.totalAdded1st ?? 0}
                actionName={"1ST_ADDED_FILTER"}
                indentLevel={" indent1stLevel"}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
          </Collapse> */}
          <li>
            <TabsCollapseContainer 
              handleOnClick={() => setMainMessagedTabs(prev => !prev)}
              tabState={MainMessagededTabs}
              tabName={'Messaged'}
              tabCount={counts?.totalMessaged ?? 0}
              indentLevel={""}
            />
          </li>
          <Collapse
            isOpen={MainMessagededTabs}>
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'ConnectMessaged' !== qs.parse(search).tF}
                tabState={"ConnectMessaged"}
                tabName={"Connect Messaged"}
                tabCount={counts?.totalConnectMessaged ?? 0}
                actionName={"CONNECT_MESSAGE_SENT_FILTER"}
                indentLevel={" indent1stLevel"}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'FollowUp1st' !== qs.parse(search).tF}
                tabState={"FollowUp1st"}
                tabName={"1st Follow Up"}
                tabCount={counts?.total1stFollowupMessaged ?? 0}
                actionName={"1ST_FOLLOW_UP_SENT_FILTER"}
                indentLevel={" indent1stLevel"}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'FollowUp2nd' !== qs.parse(search).tF}
                tabState={"FollowUp2nd"}
                tabName={"2nd Follow Up"}
                tabCount={counts?.total2ndFollowupMessaged ?? 0}
                actionName={"2ND_FOLLOW_UP_SENT_FILTER"}
                indentLevel={" indent1stLevel"}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
          </Collapse>
          {newJob &&
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'Replied' != qs.parse(search).tF}
                tabState={"Replied"}
                tabName={"Replied"}
                tabCount={counts?.replied ?? 0}
                actionName={"MESSAGE_REPLIED_FILTER"}
                indentLevel={""}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>}
            <li>
              <TabMainModule
                setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                tabStateCondition={'MeetingConfirmed' != qs.parse(search).tF}
                tabState={"MeetingConfirmed"}
                tabName={"Meeting Confirmed"}
                tabCount={counts?.totalmeetingconfirmed ?? 0}
                actionName={"MEETING_CONFIRMED_FILTER"}
                indentLevel={""}
                viewState={viewState}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                push={push}
                search={search}
                dispatch={dispatch}
                unselectAllProspects={unselectAllProspects}
              />
            </li>
        </ul>
      </div>
      <hr className="navHorizontalDevider" />
      <div className="leftNavBodySecondary" >
      <ul>
        <li>
          <TabMainModule
            setSelectAllProspectsFlag={setSelectAllProspectsFlag}
            tabStateCondition={'Archived' != qs.parse(search).tF}
            tabState={"Archived"}
            tabName={"Archived"}
            tabCount={counts?.totalArchived ?? 0}
            actionName={"ARCHIVED_FILTER"}
            indentLevel={""}
            viewState={viewState}
            activeTab = {activeTab}
            setActiveTab = {setActiveTab}
            push={push}
            search={search}
            dispatch={dispatch}
            unselectAllProspects={unselectAllProspects}
          />
        </li>
        <li>
          <TabMainModule
            setSelectAllProspectsFlag={setSelectAllProspectsFlag}
            tabStateCondition={'Downloaded' != qs.parse(search).tF}
            tabState={"Downloaded"}
            tabName={"Downloaded"}
            tabCount={counts?.totalDownloaded ?? 0}
            actionName={"DOWNLOADED_FILTER"}
            indentLevel={""}
            viewState={viewState}
            activeTab = {activeTab}
            setActiveTab = {setActiveTab}
            push={push}
            search={search}
            dispatch={dispatch}
            unselectAllProspects={unselectAllProspects}
          />
        </li>
        {newJob &&
          <li>
            <TabMainModule
              setSelectAllProspectsFlag={setSelectAllProspectsFlag}
              tabStateCondition={'Other' != qs.parse(search).tF}
              tabState={"Other"}
              tabName={"Previously Messaged"}
              tabCount={counts?.totalOthers ?? 0}
              actionName={"PREVIOUSLY_MESSAGED_FILTER"}
              indentLevel={""}
              viewState={viewState}
              activeTab = {activeTab}
              setActiveTab = {setActiveTab}
              push={push}
              search={search}
              dispatch={dispatch}
              unselectAllProspects={unselectAllProspects}
            />
          </li>}
          {/* <li>
            <TabsCollapseContainer 
              handleOnClick={() => setSavedTabs(prev => !prev)}
              tabState={SavedTabs}
              tabName={'Saved'}
              tabCount={counts?.totalSaved ?? 0}
              indentLevel={""}
            />
          </li>
          <Collapse
            isOpen={SavedTabs}>
            <li>
              <TabsCollapseContainer 
                handleOnClick={() => setSavedAddedTabs(prev => !prev)}
                tabState={SavedAddedTabs}
                tabName={'Added'}
                tabCount={counts?.totalSavedNotMessaged ?? 0}
                indentLevel={" indent1stLevel"}
              />
            </li>
          <Collapse
            isOpen={SavedAddedTabs}>
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedAND2ndAdded' != qs.parse(search).tF}
                  tabState={"SavedAND2ndAdded"}
                  tabName={"2nd/3rd"}
                  tabCount={counts?.totalSavedAdded2nd ?? 0}
                  actionName={"SAVED_ADDED_2ND_FILTER"}
                  indentLevel={" indent2ndLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedAND1stAdded' != qs.parse(search).tF}
                  tabState={"SavedAND1stAdded"}
                  tabName={"1st"}
                  tabCount={counts?.totalSavedAdded1st ?? 0}
                  actionName={"SAVED_ADDED_1ST_FILTER"}
                  indentLevel={" indent2ndLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>
            </Collapse>
            <li>
              <TabsCollapseContainer 
                handleOnClick={() => setSavedMessagedTabs(prev => !prev)}
                tabState={SavedMessagedTabs}
                tabName={'Messaged'}
                tabCount={counts?.totalSavedMessaged ?? 0}
                indentLevel={" indent1stLevel"}
              />
            </li>
            <Collapse
              isOpen={SavedMessagedTabs}>
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedANDMessaged' != qs.parse(search).tF}
                  tabState={"SavedANDMessaged"}
                  tabName={"Connect Messaged"}
                  tabCount={counts?.totalSaved1stMessaged ?? 0}
                  actionName={"SAVED_CONNECT_MESSAGE_SENT_FILTER"}
                  indentLevel={" indent2ndLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedANDFollowUp1st' != qs.parse(search).tF}
                  tabState={"SavedANDFollowUp1st"}
                  tabName={"1st Follow Up"}
                  tabCount={counts?.totalSaved2ndMessaged ?? 0}
                  actionName={"SAVED_1ST_FOLLOW_UP_SENT_FILTER"}
                  indentLevel={" indent2ndLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedANDFollowUp2nd' != qs.parse(search).tF}
                  tabState={"SavedANDFollowUp2nd"}
                  tabName={"2nd Follow Up"}
                  tabCount={counts?.totalSaved3rdMessaged ?? 0}
                  actionName={"SAVED_2ND_FOLLOW_UP_SENT_FILTER"}
                  indentLevel={" indent2ndLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>
            </Collapse>
            {newJob &&
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedANDReplied' != qs.parse(search).tF}
                  tabState={"SavedANDReplied"}
                  tabName={"Replied"}
                  tabCount={counts?.totalSavedANDReplied ?? 0}
                  actionName={"SAVED_MESSAGE_REPLIED_FILTER"}
                  indentLevel={" indent1stLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>}
            {newJob &&
              <li>
                <TabMainModule
                  setSelectAllProspectsFlag={setSelectAllProspectsFlag}
                  tabStateCondition={'SavedANDPrevMessaged' != qs.parse(search).tF}
                  tabState={"SavedANDPrevMessaged"}
                  tabName={"Previously Messaged"}
                  tabCount={counts?.totalSavedANDPrevMessaged ?? 0}
                  actionName={"SAVED_PREVIOUSLY_MESSAGED_FILTER"}
                  indentLevel={" indent1stLevel"}
                  viewState={viewState}
                  activeTab = {activeTab}
                  setActiveTab = {setActiveTab}
                  push={push}
                  search={search}
                  dispatch={dispatch}
                  unselectAllProspects={unselectAllProspects}
                />
              </li>}
          </Collapse> */}
        </ul>
      </div>

    </React.Fragment>
  )
}

export default withRouter(TabsSection)
