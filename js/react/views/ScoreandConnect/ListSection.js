import React from "react";
import ListItem from './ListItem'
import './style.css'


const ListSection = (props) => {

  const {
    userName,
    composeMessageState,
    requestMeetingState,
    isArchiving,
    isUnarchiving,
    isDownloading,
    data,
    activeTab,
    totalRecord,
    selected,
    dispatch,
    enhancing,
    // moreDetailsPopUp,
    // setMoreDetailsPopUp,
    SelectAllProspectsFlag,
    setSelectAllProspectsFlag,
    setRefState,
    refState,
    thisUser,
    jobId,
    ownerName,
    loadingActivities,
    ...rest

  } = props

  console.log('LIST SECTION RENDER: ', selected)

  console.log('REST PROPS ARE: ', rest)
  // console.log(ownerName)
  return (

    <div>
      {data.map((item, i) => {
        const isEnhancing = enhancing.data.includes(item.id)
        return (
          <ListItem
            thisUser={thisUser}
            userName={userName}
            composeMessageState={composeMessageState}
            requestMeetingState={requestMeetingState}
            isArchiving={isArchiving}
            isUnarchiving={isUnarchiving}
            isDownloading={isDownloading}

            activeTab={activeTab}
            index={i}
            refState={refState}
            setRefState={setRefState}
            totalRecord={totalRecord}
            SelectAllProspectsFlag={SelectAllProspectsFlag}
            setSelectAllProspectsFlag={setSelectAllProspectsFlag}
            // moreDetailsPopUp={moreDetailsPopUp}
            // setMoreDetailsPopUp={setMoreDetailsPopUp}
            item={item}
            key={item.id || i}
            // selected={selected}
            isSelected={selected.includes(item.id)}
            selectedCount={selected.length}
            dispatch={dispatch}
            isEnhancing={isEnhancing}
            jobId={jobId}
            ownerName={ownerName}
            loadingActivities={loadingActivities}
          />
        )
      }
      )}
    </div>
  )
}
export default ListSection