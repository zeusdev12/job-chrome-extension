import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'
import './style.css'
import { fetchTribeMembers, clearTribeState, fetchTribeMembersList, fetchTribeActivity,clearStateActivity } from '../../actions/tribe'
import Activities from './Activities'
import Content from './Content'
import Tribe from '../Tribe'
import MemberActivity from './MemberActivity'

const MyTribe = ({
    search,
    push,
    dispatch,
    tribeMembers = [],
    isLoading,
    permissions
}) => {

    const [searchTextBox, setSearchTextBox] = useState('')
    const [tribeId, setTribeId] = useState(null)
    const [type, setType] = useState(1)
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')

    const [showTribe, setShowTribe] = useState(false)
    const [tribeMode, setTribeMode] = useState(0)

    const [showMemberActivity, setShowMemberActivity] = useState(false)
    const jobId = qs.parse(search).jId
    let owner;
   
    const setSearching = (userId) => {
        dispatch(fetchTribeMembers(tribeId, userId))
    }

    const handleGoBack = () => {
        dispatch(clearStateActivity())
        setShowMemberActivity(false)
    }

    const handleShowMemberActivity = (id,name) => {
        setUserId(id)
        setUserName(name)
        setShowMemberActivity(true)
    }

    const handleAddTribe = () => {
        dispatch(clearTribeState())
        setShowTribe(true)
        setTribeMode(1)
    }

    const handleCancel = () => {
        setShowTribe(false)
        setTribeMode(0)
    }

    const handleAfterAdding = () => {
        setShowTribe(false)
        setTribeMode(0)
    }

    const handleEditTribe = () => {
        dispatch(clearTribeState())
        setShowTribe(true)
        setTribeMode(2)
    }
    useEffect(() => {
        let id = null;
        chrome.storage.local.get('jobArray', (result) => {
            const [jobData] = result.jobArray.filter(jobs => jobs.jobID == jobId)
            console.log(jobData)
            if (jobData.tribeId) {
                setTribeId(jobData.tribeId)
                id = jobData.tribeId;
                setType(2)
                if (searchTextBox === '' &&!showTribe) {
                    dispatch(fetchTribeMembers(id))
                }
            }
            else {
                setTribeId(null)
                setType(1)
            }
        })
    }, [searchTextBox, showTribe])



    return (
        <>
            { showMemberActivity ?
                <MemberActivity
                    jobId={jobId}
                    userId={userId}
                    userName={userName}
                    handleGoBack={handleGoBack}
                />

                :
                <>
                    {showTribe &&
                        tribeMode === 1 ?
                        <Tribe
                            isAddingTribe={true}
                            jobId={jobId}
                            tribeId={tribeId}
                            handleCancel={handleCancel}
                            handleAfterAdding={handleAfterAdding} />
                        : tribeMode === 2 &&
                        <Tribe
                            isEditingTribe={true}
                            jobId={jobId}
                            tribeId={tribeId}
                            handleDiscardChanges={handleCancel}
                            handleAfterEditing={handleAfterAdding}
                            tribeId={tribeId}
                        />

                    }
                    {!showTribe &&
                        <div className="my-tribe-container">
                            <Content
                                permissions={permissions}
                                search={search}
                                tribeMembers={tribeMembers}
                                searchTextBox={searchTextBox}
                                setSearchTextBox={setSearchTextBox}
                                setSearching={setSearching}
                                isLoading={isLoading}
                                owner={owner}
                                type={type}
                                showAddTribe={showTribe}
                                handleAddTribe={handleAddTribe}
                                handleEditTribe={handleEditTribe}
                                handleShowMemberActivity={handleShowMemberActivity}
                               
                            />
                            <Activities jobId={jobId} u/>

                        </div>
                    }
                </>
            }
        </>
    )
}
export default connect(state => ({
    tribeMembers: state.tribe.tribeMembers.list,
    isLoading: state.tribe.tribeMembers.isLoading,
    activityList: state.tribe.activities.activityList
}))(MyTribe)